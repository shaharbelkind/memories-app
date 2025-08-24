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
exports.OLMResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const prisma_service_1 = require("../prisma.service");
const s3_service_1 = require("../s3.service");
let ARObjectGQL = class ARObjectGQL {
    id;
    label;
    previewUrl;
    meshUrl;
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], ARObjectGQL.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ARObjectGQL.prototype, "label", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ARObjectGQL.prototype, "previewUrl", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ARObjectGQL.prototype, "meshUrl", void 0);
ARObjectGQL = __decorate([
    (0, graphql_1.ObjectType)()
], ARObjectGQL);
let OLMResolver = class OLMResolver {
    prisma;
    s3;
    constructor(prisma, s3) {
        this.prisma = prisma;
        this.s3 = s3;
    }
    async arObjects(childId) {
        const list = await this.prisma.aRObject.findMany({ where: { childId } });
        const results = [];
        for (const o of list) {
            results.push({
                id: o.id,
                label: o.label,
                previewUrl: o.previewKey ? await this.s3.presignGet(o.previewKey) : undefined,
                meshUrl: o.meshKey ? await this.s3.presignGet(o.meshKey) : undefined,
            });
        }
        return results;
    }
    async createARObject(childId, label) {
        const obj = await this.prisma.aRObject.create({ data: { childId, label } });
        return { id: obj.id, label: obj.label };
    }
    async linkMemoryToObject(objectId, memoryId) {
        await this.prisma.aRLink.create({ data: { objectId, memoryId } });
        return true;
    }
};
exports.OLMResolver = OLMResolver;
__decorate([
    (0, graphql_1.Query)(() => [ARObjectGQL]),
    __param(0, (0, graphql_1.Args)('childId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OLMResolver.prototype, "arObjects", null);
__decorate([
    (0, graphql_1.Mutation)(() => ARObjectGQL),
    __param(0, (0, graphql_1.Args)('childId')),
    __param(1, (0, graphql_1.Args)('label')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OLMResolver.prototype, "createARObject", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('objectId')),
    __param(1, (0, graphql_1.Args)('memoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OLMResolver.prototype, "linkMemoryToObject", null);
exports.OLMResolver = OLMResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, s3_service_1.S3Service])
], OLMResolver);
