export const S3Folder = {
  AVATARS: 'avatars',
  RECIPES: 'recipes',
} as const

export type S3Folder = (typeof S3Folder)[keyof typeof S3Folder]

export const S3_FOLDERS = Object.values(S3Folder)
