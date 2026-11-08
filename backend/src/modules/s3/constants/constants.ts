import * as path from 'node:path';

export const imgConstants = {
  MAX_FILE_SIZE: 8 * 1024 * 1024,
};

type ImageKind = {
  mime: string;
  extensions: string[];
};

const JPEG: ImageKind = { mime: 'image/jpeg', extensions: ['.jpg', '.jpeg'] };
const PNG: ImageKind = { mime: 'image/png', extensions: ['.png'] };
const GIF: ImageKind = { mime: 'image/gif', extensions: ['.gif'] };
const WEBP: ImageKind = { mime: 'image/webp', extensions: ['.webp'] };
const BMP: ImageKind = { mime: 'image/bmp', extensions: ['.bmp'] };
const TIFF: ImageKind = { mime: 'image/tiff', extensions: ['.tif', '.tiff'] };
const AVIF: ImageKind = { mime: 'image/avif', extensions: ['.avif'] };
const HEIF: ImageKind = {
  mime: 'image/heif',
  extensions: ['.heic', '.heif'],
};

const KINDS = [JPEG, PNG, GIF, WEBP, BMP, TIFF, AVIF, HEIF];

export function imageExtension(name: string): string {
  return path.extname(name).toLowerCase();
}

export function hasAllowedImageExtension(name: string): boolean {
  const extension = imageExtension(name);
  return KINDS.some((kind) => kind.extensions.includes(extension));
}

function readAscii(buffer: Buffer, start: number, end: number): string {
  if (buffer.length < end) return '';
  return buffer.toString('ascii', start, end);
}

function hasFtypBrand(buffer: Buffer, brands: string[]): boolean {
  if (readAscii(buffer, 4, 8) !== 'ftyp') return false;
  const found = new Set<string>();
  const major = readAscii(buffer, 8, 12);
  if (major) found.add(major);
  const limit = Math.min(buffer.length, 64);
  for (let offset = 16; offset + 4 <= limit; offset += 4) {
    found.add(readAscii(buffer, offset, offset + 4));
  }
  return brands.some((brand) => found.has(brand));
}

function isBmp(buffer: Buffer): boolean {
  if (buffer.length < 26 || buffer[0] !== 0x42 || buffer[1] !== 0x4d) {
    return false;
  }
  const header = buffer.readUInt32LE(14);
  return [12, 40, 64, 108, 124].includes(header);
}

export function detectImage(buffer: Buffer): ImageKind | null {
  if (!buffer || buffer.length < 3) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return JPEG;
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return PNG;
  }
  const gif = readAscii(buffer, 0, 6);
  if (gif === 'GIF87a' || gif === 'GIF89a') return GIF;
  if (
    readAscii(buffer, 0, 4) === 'RIFF' &&
    readAscii(buffer, 8, 12) === 'WEBP'
  ) {
    return WEBP;
  }
  if (isBmp(buffer)) return BMP;
  if (
    buffer.length >= 4 &&
    ((buffer[0] === 0x49 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x2a &&
      buffer[3] === 0x00) ||
      (buffer[0] === 0x4d &&
        buffer[1] === 0x4d &&
        buffer[2] === 0x00 &&
        buffer[3] === 0x2a))
  ) {
    return TIFF;
  }
  if (hasFtypBrand(buffer, ['avif', 'avis'])) return AVIF;
  if (
    hasFtypBrand(buffer, [
      'heic',
      'heix',
      'hevc',
      'hevx',
      'heim',
      'heis',
      'mif1',
      'msf1',
    ])
  ) {
    return HEIF;
  }
  return null;
}

export function matchedImage(file: {
  originalname: string;
  buffer: Buffer;
}): ImageKind | null {
  const kind = detectImage(file.buffer);
  if (!kind) return null;
  return kind.extensions.includes(imageExtension(file.originalname))
    ? kind
    : null;
}
