import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { s3MulterConfig } from 'src/config/s3.config';

export function S3Files(
  fields: { name: string; maxCount?: number }[],
  options: Partial<MulterOptions> = {},
) {
  return applyDecorators(
    UseInterceptors(
      FileFieldsInterceptor(fields, { ...s3MulterConfig, ...options }),
    ),
  );
}
