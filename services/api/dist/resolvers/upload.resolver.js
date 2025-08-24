"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const s3_service_1 = require("../s3.service");
const prisma_service_1 = require("../prisma.service");
let Presigned = class Presigned {
    url;
    key;
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Presigned.prototype, "url", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Presigned.prototype, "key", void 0);
Presigned = __decorate([
    (0, graphql_1.ObjectType)()
], Presigned);
let UploadResolver = class UploadResolver {
    s3;
    prisma;
    constructor(s3, prisma) {
        this.s3 = s3;
        this.prisma = prisma;
    }
    async createUploadUrl(childId, filename, contentType, kind) {
        // For now, create a mock upload URL that points to a placeholder
        const key = `raw/${childId}/${Date.now()}-${filename}`;
        const mockUrl = `https://picsum.photos/400/300?${Date.now()}`;
        // Pre-create Memory row with mock data
        const mem = await this.prisma.memory.create({
            data: {
                childId,
                kind,
                url: mockUrl,
                s3RawKey: key
            }
        });
        return { url: mockUrl, key: mem.id };
    }
};
exports.UploadResolver = UploadResolver;
__decorate([
    (0, graphql_1.Mutation)(() => Presigned),
    __param(0, (0, graphql_1.Args)('childId')),
    __param(1, (0, graphql_1.Args)('filename')),
    __param(2, (0, graphql_1.Args)('contentType')),
    __param(3, (0, graphql_1.Args)('kind')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], UploadResolver.prototype, "createUploadUrl", null);
exports.UploadResolver = UploadResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [s3_service_1.S3Service, prisma_service_1.PrismaService])
], UploadResolver);
