import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  assertProductionDatabaseUrl,
  databaseUrlForPrisma,
} from './database-url';

const LOCAL_URL =
  'postgresql://cookbook:cookbook@localhost:5432/cookbook?schema=public';
const POOLED =
  'postgresql://app:secret@ep-example-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require';
const DIRECT =
  'postgresql://app:secret@ep-example.eu-central-1.aws.neon.tech/neondb?sslmode=require';

describe('databaseUrlForPrisma', () => {
  it('leaves a local Postgres URL unchanged', () => {
    assert.equal(databaseUrlForPrisma(LOCAL_URL), LOCAL_URL);
  });

  it('leaves a local URL with an encoded password and extra parameters unchanged', () => {
    const url =
      'postgresql://cookbook:p%40ss%2Fword@db:5432/cookbook?schema=public&options=-c%20search_path%3Dpublic';
    assert.equal(databaseUrlForPrisma(url), url);
  });

  it('appends Neon timeouts and preserves encoded credentials, channel_binding, and other parameters', () => {
    const url =
      'postgresql://app:p%40ss%2Fword%23hash%3Acolon%26amp@ep-example-pooler.eu-central-1.aws.neon.tech:5432/neondb?sslmode=require&channel_binding=require&options=-c%20search_path%3Dpublic&application_name=cook%20book';

    assert.equal(
      databaseUrlForPrisma(url),
      `${url}&connect_timeout=15&pool_timeout=20`,
    );
  });

  it('keeps an explicit connect timeout', () => {
    const url = `${POOLED}&connect_timeout=30&pool_timeout=30`;
    assert.equal(databaseUrlForPrisma(url), url);
  });
});

describe('assertProductionDatabaseUrl', () => {
  it('accepts local Postgres used by Docker Compose in production mode', () => {
    assert.doesNotThrow(() => assertProductionDatabaseUrl(LOCAL_URL));
  });

  it('accepts a pooled Neon URL with sslmode=require', () => {
    assert.doesNotThrow(() => assertProductionDatabaseUrl(POOLED));
  });

  it('rejects a Neon URL that is not pooled', () => {
    assert.throws(() => assertProductionDatabaseUrl(DIRECT), /pooled host/);
  });

  it('rejects a Neon URL without SSL', () => {
    assert.throws(
      () =>
        assertProductionDatabaseUrl(
          'postgresql://app:secret@ep-example-pooler.eu-central-1.aws.neon.tech/neondb',
        ),
      /sslmode=require/,
    );
  });

  it('accepts channel_binding=require on a pooled Neon URL', () => {
    assert.doesNotThrow(() =>
      assertProductionDatabaseUrl(`${POOLED}&channel_binding=require`),
    );
  });

  it('does not include the connection string in the error', () => {
    assert.throws(
      () => assertProductionDatabaseUrl(DIRECT),
      (error: Error) => {
        assert.equal(error.message.includes('secret'), false);
        assert.equal(error.message.includes('postgresql://'), false);
        return true;
      },
    );
  });
});
