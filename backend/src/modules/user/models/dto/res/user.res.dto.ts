export class UserResDto {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  /** S3 object key (used for update/delete). */
  image?: string;
  /** Temporary signed URL for displaying a private object. */
  imageUrl?: string;
  phone?: string;
}
