export const imgConstants = {
  MAX_FILE_SIZE: 8 * 1024 * 1024,
  IMAGE_EXTENSIONS: [
    '.png',
    '.jpg',
    '.jpeg',
    '.webp',
    '.gif',
    '.avif',
    '.heic',
    '.heif',
    '.bmp',
    '.tif',
    '.tiff',
  ],
};

export function isAllowedImage(file: {
  mimetype: string;
  originalname: string;
}): boolean {
  const type = file.mimetype.toLowerCase();
  if (type.startsWith('image/') && type !== 'image/svg+xml') return true;

  const name = file.originalname.toLowerCase();
  return imgConstants.IMAGE_EXTENSIONS.some((ext) => name.endsWith(ext));
}
