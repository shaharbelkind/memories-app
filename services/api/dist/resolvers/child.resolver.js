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
const prisma_service_1 = require("../prisma.service");
let Child = class Child {
    id;
    name;
    dob;
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Child.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Child.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Child.prototype, "dob", void 0);
Child = __decorate([
    (0, graphql_1.ObjectType)()
], Child);
let ChildInput = class ChildInput {
    name;
    dob;
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ChildInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ChildInput.prototype, "dob", void 0);
ChildInput = __decorate([
    (0, graphql_1.InputType)()
], ChildInput);
let ChildResolver = class ChildResolver {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async children() { return this.prisma.child.findMany(); }
    async child(id) { return this.prisma.child.findUnique({ where: { id } }); }
    async createChild(input) {
        return this.prisma.child.create({ data: { name: input.name, dob: input.dob ? new Date(input.dob) : undefined } });
    }
};
exports.ChildResolver = ChildResolver;
__decorate([
    (0, graphql_1.Query)(() => [Child]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChildResolver.prototype, "children", null);
__decorate([
    (0, graphql_1.Query)(() => Child, { nullable: true }),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChildResolver.prototype, "child", null);
__decorate([
    (0, graphql_1.Mutation)(() => Child),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChildInput]),
    __metadata("design:returntype", Promise)
], ChildResolver.prototype, "createChild", null);
exports.ChildResolver = ChildResolver = __decorate([
    (0, graphql_1.Resolver)(() => Child),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChildResolver);
