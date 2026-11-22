import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import sharp from 'sharp';

import {
  prepareUploadImage,
  UPLOAD_IMAGE_MAX_EDGE,
} from './prepare-upload-image';

describe('prepareUploadImage', () => {
  it('shrinks a large photo to the max edge and stores WebP', async () => {
    const source = await sharp({
      create: {
        width: 2400,
        height: 1200,
        channels: 3,
        background: { r: 180, g: 90, b: 40 },
      },
    })
      .jpeg()
      .toBuffer();

    const prepared = await prepareUploadImage(source, 'image/jpeg');
    const meta = await sharp(prepared.body).metadata();

    assert.equal(prepared.contentType, 'image/webp');
    assert.equal(prepared.extension, '.webp');
    assert.ok(prepared.body.length < source.length);
    assert.equal(meta.width, UPLOAD_IMAGE_MAX_EDGE);
    assert.equal(meta.height, UPLOAD_IMAGE_MAX_EDGE / 2);
  });

  it('does not enlarge a photo that is already small enough', async () => {
    const source = await sharp({
      create: {
        width: 320,
        height: 200,
        channels: 3,
        background: { r: 20, g: 80, b: 40 },
      },
    })
      .png()
      .toBuffer();

    const prepared = await prepareUploadImage(source, 'image/png');
    const meta = await sharp(prepared.body).metadata();

    assert.equal(meta.width, 320);
    assert.equal(meta.height, 200);
    assert.equal(meta.format, 'webp');
  });

  it('leaves GIF bytes unchanged', async () => {
    const source = Buffer.from('GIF89a-not-really-animated');
    const prepared = await prepareUploadImage(source, 'image/gif');

    assert.equal(prepared.contentType, 'image/gif');
    assert.equal(prepared.extension, '.gif');
    assert.equal(prepared.body, source);
  });
});
