import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private s3 = new S3Client({
    forcePathStyle: true,
    region: 'us-east-1',
    endpoint: process.env.S3_ENDPOINT,
    credentials: { accessKeyId: process.env.S3_ACCESS_KEY!, secretAccessKey: process.env.S3_SECRET_KEY! }
  });
  bucket = process.env.S3_BUCKET!;

  async presignPut(key: string, contentType: string){
    const cmd = new PutObjectCommand({ Bucket: this.bucket, Key: key, ContentType: contentType });
    const url = await getSignedUrl(this.s3, cmd, { expiresIn: 900 });
    return { url, key };
  }

  async presignGet(key: string){
    const cmd = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    const url = await getSignedUrl(this.s3, cmd, { expiresIn: 900 });
    return url;
  }
}
