const WEAK_JWT_SECRETS = new Set([
  'access secret',
  'refresh secret',
  'change_me_access_token_secret_min_32_chars',
  'change_me_refresh_token_secret_min_32_chars',
]);

const REQUIRED_PRODUCTION_ENV = [
  'DATABASE_URL',
  'AUTH_ACCESS_TOKEN_SECRET',
  'AUTH_REFRESH_TOKEN_SECRET',
  'FRONTEND_URL',
  'ALLOWED_ORIGINS',
  'AWS_REGION',
  'AWS_S3_REGION',
  'AWS_S3_BUCKET_NAME',
  'SES_FROM_EMAIL',
] as const;

export function assertProductionConfig(): void {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const missing = REQUIRED_PRODUCTION_ENV.filter(
    (key) => !process.env[key]?.trim(),
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required production environment variables: ${missing.join(', ')}`,
    );
  }

  const accessSecret = process.env.AUTH_ACCESS_TOKEN_SECRET!.trim();
  const refreshSecret = process.env.AUTH_REFRESH_TOKEN_SECRET!.trim();

  if (
    WEAK_JWT_SECRETS.has(accessSecret) ||
    WEAK_JWT_SECRETS.has(refreshSecret) ||
    accessSecret.length < 32 ||
    refreshSecret.length < 32
  ) {
    throw new Error(
      'Production JWT secrets must be strong unique values (min 32 chars), not defaults',
    );
  }
}
