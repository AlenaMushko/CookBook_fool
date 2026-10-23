# AWS Elastic Beanstalk deploy (Docker Compose)

Cheap educational setup: **ALB + Auto Scaling (1–3)** · **ECR images** · **private RDS** (auth sessions in PostgreSQL) · **S3 + SES** via instance IAM role.

Region: **eu-west-1**.

## Local checks

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db

cd backend
npm install
npm run prisma:migrate:deploy
npm run prisma:seed:catalogs          # reference data only
# optional demos: SEED_DEMO=true npm run prisma:seed
npm run start:dev

cd ../fe && npm install && npm run dev
```

Auth sessions (access + refresh) live in PostgreSQL as **SHA-256 hashes** with `expiresAt`. Expired rows never grant access.

## Build images for linux/amd64 (ECR)

```bash
export AWS_REGION=eu-west-1
export AWS_ACCOUNT_ID=YOUR_ACCOUNT_ID
export ECR_REGISTRY=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
export IMAGE_TAG=$(git rev-parse --short HEAD)

aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ECR_REGISTRY"

docker build --platform linux/amd64 -t "$ECR_REGISTRY/cookbook-api:$IMAGE_TAG" -f backend/Dockerfile backend
docker build --platform linux/amd64 -t "$ECR_REGISTRY/cookbook-web:$IMAGE_TAG" -f fe/Dockerfile .

docker push "$ECR_REGISTRY/cookbook-api:$IMAGE_TAG"
docker push "$ECR_REGISTRY/cookbook-web:$IMAGE_TAG"
```

## Parameters you get from AWS (later)

| Variable | Source |
|---|---|
| `DATABASE_URL` | RDS endpoint + DB user/password |
| `FRONTEND_URL` / `ALLOWED_ORIGINS` | EB environment CNAME (or custom domain) |
| `ECR_REGISTRY` | Account ID + `dkr.ecr.eu-west-1.amazonaws.com` |
| Instance role | S3 + SES + ECR pull (no static keys on EB) |

Fill the rest from [`.env.aws.example`](../.env.aws.example). Use your private S3 bucket name for `AWS_S3_BUCKET_NAME`.

## Deployment ZIP for Elastic Beanstalk

EB expects `docker-compose.yml` at the **root of the ZIP**:

```bash
cd deployment
# Set ECR_REGISTRY / IMAGE_TAG as EB env properties (preferred), or substitute before zip
zip -r cookbook-eb.zip docker-compose.yml
```

Do **not** commit generated ZIPs or account-specific EB packages — only `deployment/docker-compose.yml` and this README belong in git.

Upload the ZIP to the EB Docker Compose environment. Set environment properties from `.env.aws.example` (never commit real secrets).

Suggested capacity: min **1**, max **3** instances; scale on CPU.

## Migrations and catalogs (once, not on every instance)

Do **not** run migrate/seed in the app container `CMD` — Auto Scaling would race.

From a machine that can reach private RDS (bastion, SSM port-forward, or a one-off task in the same VPC):

```bash
docker run --rm \
  -e DATABASE_URL="$DATABASE_URL" \
  "$ECR_REGISTRY/cookbook-api:$IMAGE_TAG" \
  npx prisma migrate deploy --schema prisma/schema

docker run --rm \
  -e DATABASE_URL="$DATABASE_URL" \
  "$ECR_REGISTRY/cookbook-api:$IMAGE_TAG" \
  node dist/prisma/seed-catalogs.js
```

Catalogs seed is idempotent. Demo users/recipes are **not** created.

## SES sandbox

Sandbox is **not** a cheaper tier — it only restricts who may receive mail. AWS will reject messages to unverified recipient addresses. Verify `SES_FROM_EMAIL` and any test recipient in `AWS_REGION`. Forgot-password always returns a generic public message; SES failures are logged server-side without leaking internals.

## HTTPS / Secure cookies

Auth cookies are `HttpOnly`. `Secure` follows `COOKIE_SECURE` when set (`"true"` / `"false"`), otherwise `NODE_ENV=production`.

Until the ALB has HTTPS (ACM), browsers will not store `Secure` cookies on plain `http://…elasticbeanstalk.com`. For that interim only, set `COOKIE_SECURE=false` in EB env (also the default in `deployment/docker-compose.yml`). After HTTPS: set `COOKIE_SECURE=true` (or remove the override).

Do **not** flip `NODE_ENV` to `development` to bypass this.

Nginx forwards `X-Forwarded-Proto` from the ALB; Nest trusts one proxy hop.
