"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let S3Service = class S3Service {
    s3 = new client_s3_1.S3Client({
        forcePathStyle: true,
        region: 'us-east-1',
        endpoint: process.env.S3_ENDPOINT,
        credentials: { accessKeyId: process.env.S3_ACCESS_KEY, secretAccessKey: process.env.S3_SECRET_KEY }
    });
    bucket = process.env.S3_BUCKET;
    async presignPut(key, contentType) {
        const cmd = new client_s3_1.PutObjectCommand({ Bucket: this.bucket, Key: key, ContentType: contentType });
        const url = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, cmd, { expiresIn: 900 });
        return { url, key };
    }
    async presignGet(key) {
        const cmd = new client_s3_1.GetObjectCommand({ Bucket: this.bucket, Key: key });
        const url = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, cmd, { expiresIn: 900 });
        return url;
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)()
], S3Service);
