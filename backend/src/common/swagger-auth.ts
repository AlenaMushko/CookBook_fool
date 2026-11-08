import { createHash, timingSafeEqual } from 'crypto';
import type { NextFunction, Request, Response } from 'express';

function sameSecret(left: string, right: string): boolean {
  const leftHash = createHash('sha256').update(left).digest();
  const rightHash = createHash('sha256').update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export function swaggerCredentials(): { user: string; password: string } {
  const user = process.env.SWAGGER_USER?.trim() ?? '';
  const password = process.env.SWAGGER_PASSWORD?.trim() ?? '';

  if (user && password) return { user, password };

  if (process.env.NODE_ENV === 'production' || user || password) {
    throw new Error('Set both SWAGGER_USER and SWAGGER_PASSWORD');
  }

  return { user: 'cookbook', password: 'cookbook' };
}

export function swaggerAuth(user: string, password: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.path.startsWith('/docs')) {
      next();
      return;
    }

    const header = req.headers.authorization;
    const encoded = header?.startsWith('Basic ') ? header.slice(6) : '';
    const decoded = encoded
      ? Buffer.from(encoded, 'base64').toString('utf8')
      : '';
    const separator = decoded.indexOf(':');
    const givenUser = separator >= 0 ? decoded.slice(0, separator) : '';
    const givenPassword = separator >= 0 ? decoded.slice(separator + 1) : '';

    if (sameSecret(givenUser, user) && sameSecret(givenPassword, password)) {
      next();
      return;
    }

    res.setHeader('WWW-Authenticate', 'Basic realm="Cookbook API docs"');
    res.status(401).type('text/plain').send('Authentication required');
  };
}
