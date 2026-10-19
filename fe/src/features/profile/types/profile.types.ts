export type Profile = {
  id: string
  firstName: string
  lastName?: string
  email: string
  /** S3 object key */
  image?: string | null
  /** Signed URL for display (private bucket) */
  imageUrl?: string | null
  phone?: string | null
}
