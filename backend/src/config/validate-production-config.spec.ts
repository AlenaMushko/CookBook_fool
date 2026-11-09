import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { assertProductionConfig } from './validate-production-config';

const ENV_KEYS = [
  'NODE_ENV',
  'DATABASE_URL',
  'AUTH_ACCESS_TOKEN_SECRET',
  'AUTH_REFRESH_TOKEN_SECRET',
  'FRONTEND_URL',
  'ALLOWED_ORIGINS',
  'AWS_REGION',
  'AWS_S3_REGION',
  'AWS_S3_BUCKET_NAME',
  'SES_FROM_EMAIL',
  'SWAGGER_USER',
  'SWAGGER_PASSWORD',
] as const;

describe('assertProductionConfig', { concurrency: false }, () => {
  const snapshot = new Map<string, string | undefined>();

  afterEach(() => {
    for (const key of ENV_KEYS) {
      const value = snapshot.get(key);
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    snapshot.clear();
  });

  function remember(): void {
    for (const key of ENV_KEYS) snapshot.set(key, process.env[key]);
  }

  function fillProductionEnv(): void {
    process.env.NODE_ENV = 'production';
    process.env.DATABASE_URL =
      'postgresql://ci:ci@127.0.0.1:5432/cookbook?schema=public';
    process.env.AUTH_ACCESS_TOKEN_SECRET = 'a'.repeat(32);
    process.env.AUTH_REFRESH_TOKEN_SECRET = 'b'.repeat(32);
    process.env.FRONTEND_URL = 'https://cookbook.example';
    process.env.ALLOWED_ORIGINS = 'https://cookbook.example';
    process.env.AWS_REGION = 'eu-west-1';
    process.env.AWS_S3_REGION = 'eu-west-1';
    process.env.AWS_S3_BUCKET_NAME = 'cookbook-test';
    process.env.SES_FROM_EMAIL = 'cook@example.com';
    process.env.SWAGGER_USER = 'reviewer';
    process.env.SWAGGER_PASSWORD = 'long-password-1';
  }

  it('skips checks outside production', () => {
    remember();
    process.env.NODE_ENV = 'test';
    delete process.env.DATABASE_URL;
    assert.doesNotThrow(() => assertProductionConfig());
  });

  it('rejects production when required variables are missing', () => {
    remember();
    for (const key of ENV_KEYS) delete process.env[key];
    process.env.NODE_ENV = 'production';

    assert.throws(
      () => assertProductionConfig(),
      /Missing required production environment variables/,
    );
  });

  it('rejects short or default JWT secrets', () => {
    remember();
    fillProductionEnv();
    process.env.AUTH_ACCESS_TOKEN_SECRET = 'too-short';

    assert.throws(
      () => assertProductionConfig(),
      /Production JWT secrets must be strong/,
    );
  });

  it('rejects the local Swagger password', () => {
    remember();
    fillProductionEnv();
    process.env.SWAGGER_PASSWORD = 'cookbook';

    assert.throws(
      () => assertProductionConfig(),
      /SWAGGER_PASSWORD must be at least 12 characters/,
    );
  });

  it('accepts a complete production configuration', () => {
    remember();
    fillProductionEnv();
    assert.doesNotThrow(() => assertProductionConfig());
  });
});
