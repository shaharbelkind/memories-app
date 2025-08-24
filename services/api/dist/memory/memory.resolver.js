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
const common_1 = require("@nestjs/common");
const memory_service_1 = require("./memory.service");
const memory_entity_1 = require("./memory.entity");
const gql_auth_guard_1 = require("../auth/gql-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let MemoryResolver = class MemoryResolver {
    memoryService;
    constructor(memoryService) {
        this.memoryService = memoryService;
    }
    async timeline(childId, after, first) {
        return this.memoryService.findAll(childId, after, first);
    }
    async searchMemories(childId, query, topK) {
        return this.memoryService.search(childId, query, topK);
    }
    async uploadMemory(childId, file, kind, user) {
        return this.memoryService.create(childId, kind, file);
    }
    async generateAnnualFilm(childId, year) {
        // TODO: Implement film generation
        return 'job-123';
    }
    async createARObject(childId, photos) {
        // TODO: Implement 3D object creation
        return 'ar-object-456';
    }
};
exports.MemoryResolver = MemoryResolver;
__decorate([
    (0, graphql_1.Query)(() => memory_entity_1.MemoryConnection),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('childId')),
    __param(1, (0, graphql_1.Args)('after', { nullable: true })),
    __param(2, (0, graphql_1.Args)('first', { defaultValue: 50 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], MemoryResolver.prototype, "timeline", null);
__decorate([
    (0, graphql_1.Query)(() => [memory_entity_1.Memory]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('childId')),
    __param(1, (0, graphql_1.Args)('query')),
    __param(2, (0, graphql_1.Args)('topK', { defaultValue: 20 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], MemoryResolver.prototype, "searchMemories", null);
__decorate([
    (0, graphql_1.Mutation)(() => memory_entity_1.Memory),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('childId')),
    __param(1, (0, graphql_1.Args)('file')),
    __param(2, (0, graphql_1.Args)('kind')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, Object]),
    __metadata("design:returntype", Promise)
], MemoryResolver.prototype, "uploadMemory", null);
__decorate([
    (0, graphql_1.Mutation)(() => String),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('childId')),
    __param(1, (0, graphql_1.Args)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], MemoryResolver.prototype, "generateAnnualFilm", null);
__decorate([
    (0, graphql_1.Mutation)(() => String),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('childId')),
    __param(1, (0, graphql_1.Args)('photos', { type: () => [String] })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], MemoryResolver.prototype, "createARObject", null);
exports.MemoryResolver = MemoryResolver = __decorate([
    (0, graphql_1.Resolver)(() => memory_entity_1.Memory),
    __metadata("design:paramtypes", [memory_service_1.MemoryService])
], MemoryResolver);
