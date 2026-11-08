import type { Request } from 'express';
import rateLimit, { type Options } from 'express-rate-limit';

import { ErrorCode } from './constants/error-codes';

const RATE_LIMIT_BODY = {
  statusCode: 429,
  code: ErrorCode.RATE_LIMITED,
  message: 'Too many requests',
};

const AUTH_PATHS = new Set([
  '/v1/auth/sign-in',
  '/v1/auth/sign-up',
  '/v1/auth/forgot-password',
  '/v1/auth/reset-password',
  '/v1/auth/reset-password/validate',
  '/v1/auth/request-password-change',
]);

function isUnmetered(req: Request): boolean {
  return req.path === '/health';
}

function isDocs(req: Request): boolean {
  return req.path.startsWith('/docs');
}

function isAuthWrite(req: Request): boolean {
  return AUTH_PATHS.has(req.path);
}

function isExpensive(req: Request): boolean {
  if (req.method === 'POST' && req.path === '/v1/feedback') return true;
  if (req.method === 'POST' && req.path === '/v1/s3/upload-file') return true;
  return req.path.endsWith('/shopping-list/pdf');
}

function limiter(
  name: string,
  windowMs: number,
  limit: number,
  applies: (req: Request) => boolean,
): ReturnType<typeof rateLimit> {
  const options: Partial<Options> = {
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    statusCode: 429,
    message: RATE_LIMIT_BODY,
    requestPropertyName: name,
    identifier: name,
    skip: (req) => isUnmetered(req) || !applies(req),
  };
  return rateLimit(options);
}

/** Ordinary browsing stays under this. A tight loop does not. */
export const apiBurstLimit = limiter('api-burst', 60_000, 180, () => true);

export const apiSustainedLimit = limiter(
  'api-sustained',
  10 * 60_000,
  1_200,
  () => true,
);

/** Docs password guesses. The Swagger page itself stays under this. */
export const docsBurstLimit = limiter('docs-burst', 60_000, 30, isDocs);

export const docsSustainedLimit = limiter(
  'docs-sustained',
  10 * 60_000,
  120,
  isDocs,
);

/** Login, signup, and password mail are the paths worth spamming. */
export const authBurstLimit = limiter('auth-burst', 60_000, 8, isAuthWrite);

export const authSustainedLimit = limiter(
  'auth-sustained',
  15 * 60_000,
  20,
  isAuthWrite,
);

/** Mail, image uploads, and PDF generation. */
export const expensiveBurstLimit = limiter(
  'expensive-burst',
  60_000,
  10,
  isExpensive,
);

export const expensiveSustainedLimit = limiter(
  'expensive-sustained',
  10 * 60_000,
  40,
  isExpensive,
);
