"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const path_1 = require("path");
const prisma_service_1 = require("../prisma.service");
const memory_resolver_1 = require("../resolvers/memory.resolver");
const child_resolver_1 = require("../resolvers/child.resolver");
const upload_resolver_1 = require("../resolvers/upload.resolver");
const s3_service_1 = require("../s3.service");
const olm_resolver_1 = require("../resolvers/olm.resolver");
const milestone_resolver_1 = require("../resolvers/milestone.resolver");
const quest_resolver_1 = require("../resolvers/quest.resolver");
const consent_resolver_1 = require("../resolvers/consent.resolver");
const yearbook_resolver_1 = require("../resolvers/yearbook.resolver");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: (0, path_1.join)(process.cwd(), 'schema.gql'),
                sortSchema: true
            })
        ],
        providers: [prisma_service_1.PrismaService, s3_service_1.S3Service, memory_resolver_1.MemoryResolver, child_resolver_1.ChildResolver, upload_resolver_1.UploadResolver, olm_resolver_1.OLMResolver, milestone_resolver_1.MilestoneResolver, quest_resolver_1.QuestResolver, consent_resolver_1.ConsentResolver, yearbook_resolver_1.YearbookResolver]
    })
], AppModule);
