import { BadRequestException } from '@nestjs/common';
import sharp from 'sharp';

/** Longest side stored for recipe and avatar photos. */
export const UPLOAD_IMAGE_MAX_EDGE = 1600;
export const UPLOAD_IMAGE_WEBP_QUALITY = 75;
/** Keys are random, so the bytes never change for a given URL. */
export const UPLOAD_IMAGE_CACHE_CONTROL = 'public, max-age=31536000, immutable';

export type PreparedUploadImage = {
  body: Buffer;
  contentType: string;
  extension: string;
};

export async function prepareUploadImage(
  buffer: Buffer,
  mime: string,
): Promise<PreparedUploadImage> {
  // Animated GIF would collapse to a single frame.
  if (mime === 'image/gif') {
    return { body: buffer, contentType: 'image/gif', extension: '.gif' };
  }

  try {
    const body = await sharp(buffer, { failOn: 'none', animated: false })
      .rotate()
      .resize({
        width: UPLOAD_IMAGE_MAX_EDGE,
        height: UPLOAD_IMAGE_MAX_EDGE,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: UPLOAD_IMAGE_WEBP_QUALITY })
      .toBuffer();

    return { body, contentType: 'image/webp', extension: '.webp' };
  } catch {
    throw new BadRequestException('Could not process this image');
  }
}
