export interface S3MulterFile extends Express.Multer.File {
  bucket: string;
  key: string;
  acl: string;
  contentType: string;
  contentDisposition: string | null;
  contentEncoding: string | null;
  storageClass: string;
  serverSideEncryption: string | null;
  metadata: any;
  location: string;
  etag: string;
  versionId?: string;
}
