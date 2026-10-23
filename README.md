# Cookbook

A personal digital cookbook: discover recipes, save favourites, create your own, and keep everything you love to cook in one place.

Plan menus for events and for the week — the app automatically builds a shopping list.

![Cookbook landing page](fe/src/assets/images/readme.png)

## Features

- Recipes: browse, favourites, and create your own
- Menus for events and for the week
- Automatic shopping list generation
- Authentication (log in / sign up)
- Two UI languages: English and Ukrainian

## Interface language

- English (`EN`)
- Ukrainian (`УКР`)

The language switcher is available in the app header.

## Tech stack

| Layer | Stack |
|---|---|
| Frontend | React 19, TypeScript, Vite, TanStack Router, TanStack Query, Tailwind CSS, React Hook Form, Zod, i18next |
| Backend | NestJS, TypeScript, Prisma, Zod, JWT (auth), Swagger |
| Infrastructure | Docker Compose, PostgreSQL, AWS S3, Amazon SES |

Auth sessions (access / refresh tokens) are stored in **PostgreSQL** (hashed + expiry).

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — must be running (green status)
- Node.js + npm
- A `.env` file in the project root:

```bash
cp .env.example .env
```

Fill in your passwords/secrets in `.env`. Backend env is also loaded from `backend/environments/local.env` in development only (never overrides production / Elastic Beanstalk env).

AWS deploy template: [`.env.aws.example`](.env.aws.example) · step-by-step: [`deployment/README.md`](deployment/README.md).

---

## Local setup (step by step)

All Docker commands run from the **repo root**. Backend and frontend should run in separate terminals.

### Step 1. Docker (Postgres)

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db
```

File uploads use a real **AWS S3** bucket (configure keys or AWS profile in `.env`). Email uses **Amazon SES**.

Check status:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml ps
```

Stop containers:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml stop
```

### Step 2. Backend

```bash
cd backend
npm install
npm run prisma:migrate:deploy   # apply migrations (first time / after pull)
npm run prisma:seed:catalogs    # countries, categories, units, ingredients (idempotent)
# optional demos only: SEED_DEMO=true npm run prisma:seed
npm run start:dev
```

After start:

| What | URL |
|---|---|
| API | http://localhost:3000 |
| Swagger | http://localhost:3000/docs |

#### Prisma Studio (optional)

Make sure `db` is running in Docker first:

```bash
cd backend
npm run prisma:studio
```

- Prisma Studio: http://localhost:5555

### Step 3. Frontend

```bash
cd fe
npm install
npm run dev
```

- Frontend: http://localhost:5173

---

## Amazon SES (sandbox)

SES **sandbox** is not a cheaper price plan — it only limits delivery. In sandbox, AWS accepts mail only when **both** the sender (`SES_FROM_EMAIL`) and the **recipient** are verified identities in `AWS_REGION`.

Verify both the sender (`SES_FROM_EMAIL`) and any test recipient in SES. Mail to unverified addresses is rejected by AWS; the forgot-password API still returns a generic success message and logs the failure server-side.

---

## Quick checklist

1. Start Docker Desktop  
2. `docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db`  
3. `cd backend && npm install && npm run prisma:migrate:deploy && npm run prisma:seed:catalogs && npm run start:dev` → http://localhost:3000/docs  
4. `cd fe && npm install && npm run dev` → http://localhost:5173  
5. (optional) `cd backend && npm run prisma:studio` → http://localhost:5555  

## Useful links

| What | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:3000 |
| Swagger | http://localhost:3000/docs |
| Prisma Studio | http://localhost:5555 |
| AWS EB deploy notes | [deployment/README.md](deployment/README.md) |
