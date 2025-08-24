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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARObjectResolver = void 0;
const type_graphql_1 = require("type-graphql");
const ar_object_1 = require("../types/ar-object");
const child_1 = require("../types/child");
const memory_1 = require("../types/memory");
let ARObjectResolver = class ARObjectResolver {
    async arObjects(childId) {
        const arObjects = [
            {
                id: '1',
                childId: 'c1',
                name: 'Emma\'s First Teddy Bear',
                meshUrl: 'https://example.com/ar/teddy.glb',
                previewUrl: 'https://picsum.photos/200x150?1',
                linkedMemoryIds: ['m1'],
                status: ar_object_1.ARObjectStatus.COMPLETED,
                createdAt: '2024-01-15T00:00:00Z',
            },
            {
                id: '2',
                childId: 'c2',
                name: 'Leo\'s Building Blocks',
                meshUrl: 'https://example.com/ar/blocks.glb',
                previewUrl: 'https://picsum.photos/200x150?2',
                linkedMemoryIds: ['m2'],
                status: ar_object_1.ARObjectStatus.COMPLETED,
                createdAt: '2024-02-20T00:00:00Z',
            },
        ];
        return arObjects.filter(obj => !childId || obj.childId === childId);
    }
    async arObject(id) {
        const arObjects = await this.arObjects();
        return arObjects.find(obj => obj.id === id) || null;
    }
    async createARObject(input) {
        const arObject = {
            id: Date.now().toString(),
            ...input,
            meshUrl: 'https://example.com/ar/placeholder.glb',
            previewUrl: 'https://picsum.photos/200x150',
            status: ar_object_1.ARObjectStatus.PROCESSING,
            createdAt: new Date().toISOString(),
        };
        // TODO: Enqueue AR object creation job
        // await arQueue.add('create', { ...input, arObjectId: arObject.id });
        return arObject;
    }
    async child(arObject) {
        return {
            id: arObject.childId,
            name: arObject.childId === 'c1' ? 'Emma' : 'Leo',
            dob: '2019-01-01',
            createdAt: '2019-01-01T00:00:00Z',
            updatedAt: '2019-01-01T00:00:00Z',
        };
    }
    async linkedMemories(arObject) {
        return arObject.linkedMemoryIds.map(id => ({
            id,
            childId: arObject.childId,
            kind: 'PHOTO',
            url: `https://picsum.photos/600/400?${id}`,
            takenAt: arObject.createdAt,
            tags: ['ar-object'],
            createdAt: arObject.createdAt,
            updatedAt: arObject.createdAt,
        }));
    }
};
exports.ARObjectResolver = ARObjectResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [ar_object_1.ARObject]),
    __param(0, (0, type_graphql_1.Arg)('childId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ARObjectResolver.prototype, "arObjects", null);
__decorate([
    (0, type_graphql_1.Query)(() => ar_object_1.ARObject, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ARObjectResolver.prototype, "arObject", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ar_object_1.ARObject),
    __param(0, (0, type_graphql_1.Arg)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof ar_object_1.CreateARObjectInput !== "undefined" && ar_object_1.CreateARObjectInput) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], ARObjectResolver.prototype, "createARObject", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => child_1.Child),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof ar_object_1.ARObject !== "undefined" && ar_object_1.ARObject) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ARObjectResolver.prototype, "child", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => [memory_1.Memory]),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof ar_object_1.ARObject !== "undefined" && ar_object_1.ARObject) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], ARObjectResolver.prototype, "linkedMemories", null);
exports.ARObjectResolver = ARObjectResolver = __decorate([
    (0, type_graphql_1.Resolver)(ar_object_1.ARObject)
], ARObjectResolver);
