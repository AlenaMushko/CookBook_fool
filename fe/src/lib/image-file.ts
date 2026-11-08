export const IMAGE_ACCEPT =
  '.jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif,.bmp,.tif,.tiff'

type ImageKind = {
  mime: string
  extensions: string[]
}

const JPEG: ImageKind = { mime: 'image/jpeg', extensions: ['.jpg', '.jpeg'] }
const PNG: ImageKind = { mime: 'image/png', extensions: ['.png'] }
const GIF: ImageKind = { mime: 'image/gif', extensions: ['.gif'] }
const WEBP: ImageKind = { mime: 'image/webp', extensions: ['.webp'] }
const BMP: ImageKind = { mime: 'image/bmp', extensions: ['.bmp'] }
const TIFF: ImageKind = { mime: 'image/tiff', extensions: ['.tif', '.tiff'] }
const AVIF: ImageKind = { mime: 'image/avif', extensions: ['.avif'] }
const HEIF: ImageKind = { mime: 'image/heif', extensions: ['.heic', '.heif'] }

const readAscii = (bytes: Uint8Array, start: number, end: number) => {
  if (bytes.length < end) return ''
  let text = ''
  for (let index = start; index < end; index += 1) {
    text += String.fromCharCode(bytes[index])
  }
  return text
}

const hasFtypBrand = (bytes: Uint8Array, brands: string[]) => {
  if (readAscii(bytes, 4, 8) !== 'ftyp') return false
  const found = new Set<string>()
  const major = readAscii(bytes, 8, 12)
  if (major) found.add(major)
  const limit = Math.min(bytes.length, 64)
  for (let offset = 16; offset + 4 <= limit; offset += 4) {
    found.add(readAscii(bytes, offset, offset + 4))
  }
  return brands.some((brand) => found.has(brand))
}

const isBmp = (bytes: Uint8Array) => {
  if (bytes.length < 26 || bytes[0] !== 0x42 || bytes[1] !== 0x4d) return false
  const header =
    bytes[14] | (bytes[15] << 8) | (bytes[16] << 16) | (bytes[17] << 24)
  return header === 12 || header === 40 || header === 64 || header === 108 || header === 124
}

export const detectImage = (bytes: Uint8Array): ImageKind | null => {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return JPEG
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return PNG
  }
  const gif = readAscii(bytes, 0, 6)
  if (gif === 'GIF87a' || gif === 'GIF89a') return GIF
  if (readAscii(bytes, 0, 4) === 'RIFF' && readAscii(bytes, 8, 12) === 'WEBP') return WEBP
  if (isBmp(bytes)) return BMP
  if (
    bytes.length >= 4 &&
    ((bytes[0] === 0x49 && bytes[1] === 0x49 && bytes[2] === 0x2a && bytes[3] === 0x00) ||
      (bytes[0] === 0x4d && bytes[1] === 0x4d && bytes[2] === 0x00 && bytes[3] === 0x2a))
  ) {
    return TIFF
  }
  if (hasFtypBrand(bytes, ['avif', 'avis'])) return AVIF
  if (hasFtypBrand(bytes, ['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'mif1', 'msf1'])) {
    return HEIF
  }
  return null
}

const extensionOf = (name: string) => {
  const dot = name.lastIndexOf('.')
  if (dot < 0) return ''
  return name.slice(dot).toLowerCase()
}

export const isAllowedImageFile = async (file: File) => {
  const kind = detectImage(new Uint8Array(await file.slice(0, 64).arrayBuffer()))
  return kind != null && kind.extensions.includes(extensionOf(file.name))
}
