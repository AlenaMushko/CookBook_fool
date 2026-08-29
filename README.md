# CookBook

Локальний запуск інфраструктури, бекенду та фронтенду.

## Передумови

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) запущений (зелений статус)
- Node.js + npm
- Файл `.env` у корені проєкту (`cp .env.example .env` і підстав свої паролі)

## 1. Docker (Postgres, Redis, MinIO)

З **кореня** репозиторію:

```bash
# тільки Postgres (достатньо для Prisma Studio)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db

# для повного бекенду — ще Redis і MinIO
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db redis minio
```

Перевірка:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml ps
```

Зупинити:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml stop
```

## 2. Backend

```bash
cd backend
npm install
npm run prisma:migrate:deploy   # застосувати міграції (перший раз / після pull)
npm run prisma:seed             # опційно: демо-дані
npm run start:dev
```

- API: http://localhost:3000  
- Swagger (документація API): http://localhost:3000/docs  

Env підхоплюється з `backend/environments/local.env` і кореневого `.env`.

### Prisma Studio (перегляд БД у браузері)

Спочатку має працювати `db` у Docker, потім:

```bash
cd backend
npm run prisma:studio
```

- Prisma Studio: http://localhost:5555  

## 3. Frontend

```bash
cd fe
npm install
npm run dev
```

Зазвичай: http://localhost:5173

## Корисні посилання

| Що | URL |
|---|---|
| Swagger | http://localhost:3000/docs |
| Prisma Studio | http://localhost:5555 |
| API | http://localhost:3000 |
| Frontend (Vite) | http://localhost:5173 |

## Швидкий чеклист

1. Запустити Docker Desktop  
2. `docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db redis minio`  
3. `cd backend && npm run start:dev` → http://localhost:3000/docs  
4. `cd fe && npm run dev`  
5. (опційно) `cd backend && npm run prisma:studio` → http://localhost:5555  


Cmd+Shift+P → TypeScript: Restart TS Server.