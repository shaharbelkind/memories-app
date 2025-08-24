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
exports.QuestResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const prisma_service_1 = require("../prisma.service");
let QuestGQL = class QuestGQL {
    id;
    month;
    year;
    target;
    status;
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], QuestGQL.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], QuestGQL.prototype, "month", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], QuestGQL.prototype, "year", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], QuestGQL.prototype, "target", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], QuestGQL.prototype, "status", void 0);
QuestGQL = __decorate([
    (0, graphql_1.ObjectType)()
], QuestGQL);
let QuestResolver = class QuestResolver {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async ensureMonthlyQuest(childId, month, year, target) {
        const q = await this.prisma.quest.upsert({ where: { childId_month_year: { childId, month, year } }, update: {}, create: { childId, month, year, target } });
        return q;
    }
    async pickFavorite(questId, memoryId) {
        const q = await this.prisma.quest.findUnique({ where: { id: questId }, include: { picks: true } });
        if (!q)
            return false;
        if (q.picks.length >= q.target)
            return false;
        await this.prisma.questPick.create({ data: { questId, memoryId } });
        const picks = await this.prisma.questPick.count({ where: { questId } });
        if (picks >= q.target)
            await this.prisma.quest.update({ where: { id: questId }, data: { status: 'DONE' } });
        return true;
    }
};
exports.QuestResolver = QuestResolver;
__decorate([
    (0, graphql_1.Mutation)(() => QuestGQL),
    __param(0, (0, graphql_1.Args)('childId')),
    __param(1, (0, graphql_1.Args)('month')),
    __param(2, (0, graphql_1.Args)('year')),
    __param(3, (0, graphql_1.Args)('target', { defaultValue: 5 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], QuestResolver.prototype, "ensureMonthlyQuest", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('questId')),
    __param(1, (0, graphql_1.Args)('memoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], QuestResolver.prototype, "pickFavorite", null);
exports.QuestResolver = QuestResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuestResolver);
