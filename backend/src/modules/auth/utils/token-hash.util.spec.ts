import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createHash } from 'crypto';

import { hashToken } from './token-hash.util';

describe('hashToken', () => {
  it('returns a stable sha256 hex digest', () => {
    const raw = 'refresh-token';
    const expected = createHash('sha256').update(raw).digest('hex');

    assert.equal(hashToken(raw), expected);
    assert.equal(hashToken(raw), hashToken(raw));
    assert.notEqual(hashToken(raw), hashToken(`${raw}-other`));
  });
});
