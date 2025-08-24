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
exports.MemoryResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const prisma_service_1 = require("../prisma.service");
let Memory = class Memory {
    id;
    kind;
    url;
    takenAt;
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Memory.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Memory.prototype, "kind", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Memory.prototype, "url", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Memory.prototype, "takenAt", void 0);
Memory = __decorate([
    (0, graphql_1.ObjectType)()
], Memory);
let MemoryResolver = class MemoryResolver {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async memories(childId) {
        return this.prisma.memory.findMany({ where: { childId }, orderBy: { createdAt: 'desc' } });
    }
    async attachUploadedFile(memoryId, publicUrl) {
        return this.prisma.memory.update({ where: { id: memoryId }, data: { url: publicUrl } });
    }
};
exports.MemoryResolver = MemoryResolver;
__decorate([
    (0, graphql_1.Query)(() => [Memory]),
    __param(0, (0, graphql_1.Args)('childId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemoryResolver.prototype, "memories", null);
__decorate([
    (0, graphql_1.Mutation)(() => Memory),
    __param(0, (0, graphql_1.Args)('memoryId')),
    __param(1, (0, graphql_1.Args)('publicUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MemoryResolver.prototype, "attachUploadedFile", null);
exports.MemoryResolver = MemoryResolver = __decorate([
    (0, graphql_1.Resolver)(() => Memory),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MemoryResolver);
