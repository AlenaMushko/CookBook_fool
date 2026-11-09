const NEON_SSL_MODES = new Set(['require', 'verify-ca', 'verify-full']);

type PostgresUrlParts = {
  host: string;
  params: URLSearchParams;
};

/**
 * Reads the host and query from a Postgres URL without rebuilding the
 * userinfo, so passwords are left untouched when the URL is not rewritten.
 */
export function readPostgresUrl(url: string): PostgresUrlParts | null {
  const match =
    /^(postgres(?:ql)?):\/\/(?:[^@/?]+@)?([^/?]+)(?:\/[^?]*)?(?:\?(.*))?$/i.exec(
      url,
    );
  if (!match) return null;

  const host = match[2].replace(/:\d+$/, '').toLowerCase();
  return {
    host,
    params: new URLSearchParams(match[3] ?? ''),
  };
}

export function isNeonHost(host: string): boolean {
  return host === 'neon.tech' || host.endsWith('.neon.tech');
}

function isNeonPoolerHost(host: string): boolean {
  const endpoint = host.split('.')[0] ?? '';
  return endpoint.endsWith('-pooler');
}

/**
 * Production checks for a Neon URL. Local and Docker Compose URLs are ignored
 * so development can keep using Postgres without SSL.
 */
export function assertProductionDatabaseUrl(url: string): void {
  const parsed = readPostgresUrl(url);
  if (!parsed) {
    throw new Error(
      'Production DATABASE_URL must be a PostgreSQL connection URL',
    );
  }
  if (!isNeonHost(parsed.host)) return;

  const sslmode = parsed.params.get('sslmode');
  if (!sslmode || !NEON_SSL_MODES.has(sslmode)) {
    throw new Error(
      'Production Neon DATABASE_URL must include sslmode=require, verify-ca, or verify-full',
    );
  }

  if (!isNeonPoolerHost(parsed.host)) {
    throw new Error(
      'Production DATABASE_URL must be the Neon pooled host (the endpoint name ends with -pooler). Use the direct host only when running Prisma migrations',
    );
  }
}

/**
 * Adds missing Neon timeouts without rewriting credentials or existing query
 * parameters. Prisma 6.19.3 accepts channel_binding=require, so that parameter
 * stays. Other URLs, including local Postgres, are returned unchanged.
 */
export function databaseUrlForPrisma(url: string): string {
  const parsed = readPostgresUrl(url);
  if (!parsed || !isNeonHost(parsed.host)) return url;

  const additions: string[] = [];
  if (!parsed.params.get('sslmode')) additions.push('sslmode=require');
  if (!parsed.params.get('connect_timeout'))
    additions.push('connect_timeout=15');
  if (!parsed.params.get('pool_timeout')) additions.push('pool_timeout=20');
  if (additions.length === 0) return url;

  const hashIndex = url.indexOf('#');
  const withoutHash = hashIndex === -1 ? url : url.slice(0, hashIndex);
  const hash = hashIndex === -1 ? '' : url.slice(hashIndex);
  const joiner = withoutHash.includes('?') ? '&' : '?';
  return `${withoutHash}${joiner}${additions.join('&')}${hash}`;
}
