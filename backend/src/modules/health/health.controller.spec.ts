import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { healthPayload } from './health.controller';

describe('healthPayload', { concurrency: false }, () => {
  const previous = process.env.RENDER_GIT_COMMIT;

  afterEach(() => {
    if (previous === undefined) {
      delete process.env.RENDER_GIT_COMMIT;
    } else {
      process.env.RENDER_GIT_COMMIT = previous;
    }
  });

  it('reports ok and no commit when Render has not set one', () => {
    delete process.env.RENDER_GIT_COMMIT;
    assert.deepEqual(healthPayload(), { status: 'ok', commit: null });
  });

  it('reports the Render git commit', () => {
    process.env.RENDER_GIT_COMMIT = 'a'.repeat(40);
    assert.equal(healthPayload().commit, 'a'.repeat(40));
  });

  it('treats a blank commit as missing', () => {
    assert.equal(healthPayload('   ').commit, null);
  });
});
