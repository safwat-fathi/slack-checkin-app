import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { s3MulterConfig } from 'src/config/s3.config';

export function S3File(
  fieldName: string,
  options: Partial<MulterOptions> = {},
) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, { ...s3MulterConfig, ...options }),
    ),
  );
}
