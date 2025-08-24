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
exports.ChildResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const child_service_1 = require("./child.service");
const memory_service_1 = require("../memory/memory.service");
const child_entity_1 = require("./child.entity");
const memory_entity_1 = require("../memory/memory.entity");
const gql_auth_guard_1 = require("../auth/gql-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let ChildResolver = class ChildResolver {
    childService;
    memoryService;
    constructor(childService, memoryService) {
        this.childService = childService;
        this.memoryService = memoryService;
    }
    async child(id) {
        return this.childService.findOne(id);
    }
    async myChildren(user) {
        return this.childService.findAll(user.id);
    }
    async createChild(name, dob, user) {
        return this.childService.create(user.id, name, dob);
    }
    async timeline(child, after, first) {
        return this.memoryService.findAll(child.id, after, first);
    }
};
exports.ChildResolver = ChildResolver;
__decorate([
    (0, graphql_1.Query)(() => child_entity_1.Child),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChildResolver.prototype, "child", null);
__decorate([
    (0, graphql_1.Query)(() => [child_entity_1.Child]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChildResolver.prototype, "myChildren", null);
__decorate([
    (0, graphql_1.Mutation)(() => child_entity_1.Child),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('name')),
    __param(1, (0, graphql_1.Args)('dob', { nullable: true })),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ChildResolver.prototype, "createChild", null);
__decorate([
    (0, graphql_1.ResolveField)(() => memory_entity_1.MemoryConnection),
    __param(0, (0, graphql_1.Parent)()),
    __param(1, (0, graphql_1.Args)('after', { nullable: true })),
    __param(2, (0, graphql_1.Args)('first', { defaultValue: 50 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [child_entity_1.Child, String, Number]),
    __metadata("design:returntype", Promise)
], ChildResolver.prototype, "timeline", null);
exports.ChildResolver = ChildResolver = __decorate([
    (0, graphql_1.Resolver)(() => child_entity_1.Child),
    __metadata("design:paramtypes", [child_service_1.ChildService,
        memory_service_1.MemoryService])
], ChildResolver);
