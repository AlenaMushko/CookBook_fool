import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (
      metadata.type !== 'body' &&
      metadata.type !== 'query' &&
      metadata.type !== 'param'
    ) {
      return value;
    }

    return this.trimDeep(value);
  }

  private trimDeep(value: unknown): unknown {
    if (typeof value === 'string') {
      return value.trim();
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.trimDeep(item));
    }

    if (value === null || typeof value !== 'object') {
      return value;
    }

    if (value instanceof Date || Buffer.isBuffer(value)) {
      return value;
    }

    // Multer uploaded file
    if (
      'fieldname' in value &&
      'originalname' in value &&
      'mimetype' in value
    ) {
      return value;
    }

    return Object.entries(value as Record<string, unknown>).reduce<
      Record<string, unknown>
    >((acc, [key, nested]) => {
      acc[key] = this.trimDeep(nested);
      return acc;
    }, {});
  }
}
