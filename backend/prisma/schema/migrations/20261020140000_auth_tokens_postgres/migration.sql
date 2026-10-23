-- Persist access sessions and refresh-token hashes with expiry in PostgreSQL.
CREATE TABLE "access-tokens" (
    "id" UUID NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "access-tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "access-tokens_tokenHash_key" ON "access-tokens"("tokenHash");
CREATE INDEX "access-tokens_userId_deviceId_idx" ON "access-tokens"("userId", "deviceId");
CREATE INDEX "access-tokens_expiresAt_idx" ON "access-tokens"("expiresAt");

ALTER TABLE "access-tokens"
  ADD CONSTRAINT "access-tokens_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Invalidate existing raw refresh tokens (clients must sign in again).
DROP TABLE IF EXISTS "refresh-tokens";

CREATE TABLE "refresh-tokens" (
    "id" UUID NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "refresh-tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "refresh-tokens_tokenHash_key" ON "refresh-tokens"("tokenHash");
CREATE INDEX "refresh-tokens_userId_deviceId_idx" ON "refresh-tokens"("userId", "deviceId");
CREATE INDEX "refresh-tokens_expiresAt_idx" ON "refresh-tokens"("expiresAt");

ALTER TABLE "refresh-tokens"
  ADD CONSTRAINT "refresh-tokens_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
