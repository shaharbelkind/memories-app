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
exports.ConsentResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const prisma_service_1 = require("../prisma.service");
let ConsentOut = class ConsentOut {
    id;
    status;
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], ConsentOut.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ConsentOut.prototype, "status", void 0);
ConsentOut = __decorate([
    (0, graphql_1.ObjectType)()
], ConsentOut);
let ConsentResolver = class ConsentResolver {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async requestConsent(childId, shareId) {
        const c = await this.prisma.consent.create({ data: { childId, shareId, status: 'PENDING' } });
        return { id: c.id, status: c.status };
    }
    async respondConsent(consentId, approve) {
        const c = await this.prisma.consent.update({ where: { id: consentId }, data: { status: approve ? 'APPROVED' : 'REJECTED' } });
        return { id: c.id, status: c.status };
    }
};
exports.ConsentResolver = ConsentResolver;
__decorate([
    (0, graphql_1.Mutation)(() => ConsentOut),
    __param(0, (0, graphql_1.Args)('childId')),
    __param(1, (0, graphql_1.Args)('shareId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ConsentResolver.prototype, "requestConsent", null);
__decorate([
    (0, graphql_1.Mutation)(() => ConsentOut),
    __param(0, (0, graphql_1.Args)('consentId')),
    __param(1, (0, graphql_1.Args)('approve')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], ConsentResolver.prototype, "respondConsent", null);
exports.ConsentResolver = ConsentResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConsentResolver);
