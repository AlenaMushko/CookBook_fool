# Production

Cloudflare Pages serves the frontend. Render runs the backend container. Neon holds PostgreSQL. Photo storage stays on the existing S3 bucket, and mail stays on the existing SES identity. GitHub Actions only runs CI. Pages and Render deploy from GitHub themselves.

Do not put production passwords, Neon URLs, or AWS keys in the repository.

## CI

[`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) runs on every pull request and on every push to `main`.

| Job | What it checks |
|---|---|
| Frontend | `npm ci`, lint, TypeScript, tests, Vite build in `fe/` |
| Backend | `npm ci`, lint, TypeScript, tests, Nest build, `prisma validate`, `prisma generate` in `backend/` |
| Backend image | `docker build` with `backend/Dockerfile` and context `backend` |

The backend job uses a dummy `DATABASE_URL`. Validation and client generation do not open a database connection. Dependabot opens weekly update PRs for npm, GitHub Actions, and Dockerfiles.

After the workflow file is on `main` and GitHub has run it once, branch protection can require the checks `Frontend`, `Backend`, and `Backend image`. There is no deploy check to require.

## Cloudflare Pages

Create one Pages project connected to `AlenaMushko/CookBook_fool`.

| Setting | Value |
|---|---|
| Production branch | `main` |
| Root directory | `fe` |
| Build command | `npm ci && npm run build` |
| Build output directory | `dist` |
| Deploy command | empty. Do not add Wrangler. |

Environment variables, Production:

| Name | Value |
|---|---|
| `VITE_API_URL` | `/api` |
| `API_ORIGIN` | Render origin only, for example `https://cookbook-api.onrender.com` |

`VITE_API_URL` is read while Vite builds. `API_ORIGIN` is read by the Pages Function at request time. It must be the scheme and host only: no path, query, hash, or trailing slash.

`fe/functions/api/[[path]].js` is the `/api` proxy. Pages deploys it because the project root is `fe`. `fe/public/_redirects` is copied into `dist` and sends other paths to `index.html`. A Function match wins over that rewrite, so `/api` is not replaced with HTML.

The proxy strips `/api`, forwards the request body and headers, and returns the Render response unchanged. That keeps `accessToken`, `refreshToken`, and `hasSession` `Set-Cookie` headers, and it keeps the `multipart/form-data` boundary on `POST /api/v1/s3/upload-file`. Uploads are limited to 8 MB by the API.

Turn preview deployments off for the first launch. A preview hostname is a different site, and these cookies are `SameSite=Strict` with no `Domain`, so they are not shared with it. If a preview is enabled later, give it the same `API_ORIGIN` and its own `ALLOWED_ORIGINS` entry before using it for login.

## Render

Create one paid Web Service from the same GitHub repository.

| Setting | Value |
|---|---|
| Language / runtime | Docker |
| Region | Frankfurt |
| Branch | `main` |
| Dockerfile path | `backend/Dockerfile` |
| Docker build context | `backend` |
| Health check path | `/health` |
| Port | `3000` |
| Instances | `1` |
| Auto-deploy | On |
| Pre-deploy command | empty |
| Pull request previews | Off |

The process listens on `APP_PORT` (3000). It does not read Render's `PORT`. Set the service port to 3000 in the dashboard. Leave the pre-deploy command empty so Render does not run Prisma migrations.

`GET /health` returns `{ "status": "ok", "commit": "<sha>" }` when Render sets `RENDER_GIT_COMMIT`. The Docker health check only looks at the HTTP status.

Environment variables, set in the Render dashboard:

| Name | Value |
|---|---|
| `NODE_ENV` | `production` |
| `APP_HOST` | `0.0.0.0` |
| `APP_PORT` | `3000` |
| `DATABASE_URL` | Neon **pooled** URL for the `production` branch, database `neondb`. The hostname contains `-pooler`. Include `sslmode=require`. Keep `channel_binding=require` when Neon includes it |
| `AUTH_ACCESS_TOKEN_SECRET` | unique, at least 32 characters, not a sample value |
| `AUTH_REFRESH_TOKEN_SECRET` | a different secret, same rules |
| `FRONTEND_URL` | Pages origin, no trailing slash |
| `ALLOWED_ORIGINS` | the same Pages origin |
| `AWS_REGION` | existing SES region |
| `AWS_S3_REGION` | existing bucket region |
| `AWS_S3_BUCKET_NAME` | existing bucket |
| `AWS_ACCESS_KEY_ID` | existing IAM key that can use that bucket and send SES mail |
| `AWS_SECRET_ACCESS_KEY` | matching secret |
| `SES_FROM_EMAIL` | existing verified identity |
| `SES_FROM_NAME` | `CookBook` |
| `SWAGGER_USER` | your choice |
| `SWAGGER_PASSWORD` | at least 12 characters, not `cookbook` |

Do not set `COOKIE_SECURE`. In production the auth cookies are already `Secure`. Do not commit these values. Do not set `DIRECT_URL` on Render: Prisma 6.19 in this project does not read it. Do not point `DATABASE_URL` at the Neon direct host for the running service; the app uses the pooled host. Keep `channel_binding=require` if the Neon string includes it. Prisma 6.19.3 accepts `disable`, `prefer`, and `require`. The process adds `connect_timeout=15` and `pool_timeout=20` when they are missing, so a suspended Neon compute can wake up before Prisma gives up. Migrations use the direct host from a laptop, below.

The boot check refuses to start when a required variable is missing, a JWT secret is short or still a placeholder, or the Swagger password is `cookbook`.

## Neon

The Launch database already exists in Frankfurt: branch `production`, database `neondb`. Nothing in CI or in the container applies migrations.

When you explicitly decide to create the tables, run this once from one machine. Use the **direct** Neon connection string, not the pooled URL the service uses. The hostname must not contain `-pooler`. Keep `sslmode=require` and keep `channel_binding` when Neon includes it. Prisma CLI reads only `DATABASE_URL` from the schema, so the direct string replaces that variable for these two commands. It is not saved, and it does not change the local `.env`.

```bash
cd backend
DATABASE_URL='postgresql://USER:PASSWORD@DIRECT_HOST/neondb?sslmode=require&connect_timeout=15' npm run prisma:migrate:deploy
DATABASE_URL='postgresql://USER:PASSWORD@DIRECT_HOST/neondb?sslmode=require&connect_timeout=15' npm run prisma:seed:catalogs
```

Do not run `prisma migrate dev`, `prisma migrate reset`, or `prisma db push` against Neon. Do not seed demo users. `/health` can return 200 before the tables exist. Recipe and auth routes need the migration first.

If a migration fails halfway, restore that Neon branch from its history. Do not reset the database to “make the migration pass.”

## First launch

1. Merge this repository to `main` only after you approve it. CI must be green on GitHub.
2. Apply the Neon migration once, with the direct URL, after a separate approval.
3. Create the Render service with the settings above and confirm `GET /health` returns `status: ok`.
4. Create the Pages project with the settings above.
5. Sign in on the Pages URL, reload the page, and upload a recipe photo. Login stores the cookies. Reload uses the refresh cookie. The photo uses multipart upload. All three stay on the Pages host (`/api/...`), not on the Render host.
6. Invite other people only after those three checks work.

SES sandbox mode still delivers only to verified recipient addresses. That behavior is unchanged.

## Rollback

- Render: roll back to the previous successful deploy in the dashboard. With one instance, the next request uses that image.
- Cloudflare Pages: roll back to the previous deployment in the dashboard. Roll back Pages and Render to the same commit.
- Database: restore the Neon branch from the point before a bad migration. Application rollback does not undo schema changes.
