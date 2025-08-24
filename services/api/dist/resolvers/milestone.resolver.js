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
exports.MilestoneResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const prisma_service_1 = require("../prisma.service");
let MilestoneGQL = class MilestoneGQL {
    id;
    title;
    date;
    score;
    missing;
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], MilestoneGQL.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], MilestoneGQL.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MilestoneGQL.prototype, "date", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], MilestoneGQL.prototype, "score", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], MilestoneGQL.prototype, "missing", void 0);
MilestoneGQL = __decorate([
    (0, graphql_1.ObjectType)()
], MilestoneGQL);
function computeCompleteness(meta) {
    const required = meta.required || ['voice', 'art', 'clip', 'photo'];
    const present = new Set(meta.present || []);
    const missing = required.filter((r) => !present.has(r));
    const score = Math.round(((required.length - missing.length) / required.length) * 100);
    return { score, missing };
}
let MilestoneResolver = class MilestoneResolver {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async milestones(childId) {
        const list = await this.prisma.milestone.findMany({ where: { childId }, orderBy: { createdAt: 'desc' } });
        return list.map(m => { const c = computeCompleteness(m.completeness); return { id: m.id, title: m.title, date: m.date?.toISOString(), score: c.score, missing: c.missing }; });
    }
    async upsertMilestone(childId, title, date) {
        const ms = await this.prisma.milestone.upsert({ where: { childId_title: { childId, title } }, update: { date: date ? new Date(date) : undefined }, create: { childId, title, date: date ? new Date(date) : undefined, completeness: { required: ['voice', 'art', 'clip', 'photo'], present: [] } } });
        const c = computeCompleteness(ms.completeness);
        return { id: ms.id, title: ms.title, date: ms.date?.toISOString(), score: c.score, missing: c.missing };
    }
    async markArtifactPresent(milestoneId, kind) {
        const ms = await this.prisma.milestone.findUnique({ where: { id: milestoneId } });
        const comp = ms?.completeness || { required: ['voice', 'art', 'clip', 'photo'], present: [] };
        if (!comp.present.includes(kind))
            comp.present.push(kind);
        await this.prisma.milestone.update({ where: { id: milestoneId }, data: { completeness: comp } });
        return true;
    }
};
exports.MilestoneResolver = MilestoneResolver;
__decorate([
    (0, graphql_1.Query)(() => [MilestoneGQL]),
    __param(0, (0, graphql_1.Args)('childId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MilestoneResolver.prototype, "milestones", null);
__decorate([
    (0, graphql_1.Mutation)(() => MilestoneGQL),
    __param(0, (0, graphql_1.Args)('childId')),
    __param(1, (0, graphql_1.Args)('title')),
    __param(2, (0, graphql_1.Args)('date', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MilestoneResolver.prototype, "upsertMilestone", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('milestoneId')),
    __param(1, (0, graphql_1.Args)('kind')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MilestoneResolver.prototype, "markArtifactPresent", null);
exports.MilestoneResolver = MilestoneResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MilestoneResolver);
