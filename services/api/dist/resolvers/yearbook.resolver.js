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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YearbookResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const prisma_service_1 = require("../prisma.service");
const s3_service_1 = require("../s3.service");
const ioredis_1 = __importDefault(require("ioredis"));
const bullmq_1 = require("bullmq");
let YearbookJob = class YearbookJob {
    id;
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], YearbookJob.prototype, "id", void 0);
YearbookJob = __decorate([
    (0, graphql_1.ObjectType)()
], YearbookJob);
let YearbookOut = class YearbookOut {
    url;
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], YearbookOut.prototype, "url", void 0);
YearbookOut = __decorate([
    (0, graphql_1.ObjectType)()
], YearbookOut);
const connection = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
const renderQueue = new bullmq_1.Queue('render', { connection });
let YearbookResolver = class YearbookResolver {
    prisma;
    s3;
    constructor(prisma, s3) {
        this.prisma = prisma;
        this.s3 = s3;
    }
    async createYearbook(childId) {
        const child = await this.prisma.child.findUnique({ where: { id: childId } });
        const images = (await this.prisma.memory.findMany({ where: { childId, kind: 'PHOTO' }, take: 80, orderBy: { createdAt: 'desc' } })).map(m => m.url || m.s3ProcKey || m.s3RawKey || '');
        const job = await renderQueue.add('yearbook', { childName: child?.name || 'Child', images });
        return { id: job.id };
    }
    async getYearbook(jobId) {
        const job = await renderQueue.getJob(jobId);
        if (!job)
            throw new Error('Job not found');
        const state = await job.getState();
        const res = state === 'completed' ? job.returnvalue : null;
        if (!res?.key)
            throw new Error('Not ready');
        const url = await this.s3.presignGet(res.key);
        return { url };
    }
};
exports.YearbookResolver = YearbookResolver;
__decorate([
    (0, graphql_1.Mutation)(() => YearbookJob),
    __param(0, (0, graphql_1.Args)('childId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], YearbookResolver.prototype, "createYearbook", null);
__decorate([
    (0, graphql_1.Query)(() => YearbookOut),
    __param(0, (0, graphql_1.Args)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], YearbookResolver.prototype, "getYearbook", null);
exports.YearbookResolver = YearbookResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, s3_service_1.S3Service])
], YearbookResolver);
