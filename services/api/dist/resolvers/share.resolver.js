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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareResolver = void 0;
const type_graphql_1 = require("type-graphql");
const share_1 = require("../types/share");
const child_1 = require("../types/child");
let ShareResolver = class ShareResolver {
    async shares(childId) {
        const shares = [
            {
                id: '1',
                childId: 'c1',
                type: share_1.ShareType.FAMILY,
                email: 'grandma@example.com',
                role: 'contributor',
                permissions: ['view', 'upload'],
                status: 'active',
                createdAt: '2024-01-15T00:00:00Z',
            },
            {
                id: '2',
                childId: 'c2',
                type: share_1.ShareType.LINK,
                url: 'https://lifecapsule.app/share/abc123',
                permissions: ['view'],
                status: 'active',
                expiresAt: '2024-12-31T23:59:59Z',
                createdAt: '2024-02-20T00:00:00Z',
            },
        ];
        return shares.filter(s => !childId || s.childId === childId);
    }
    async share(id) {
        const shares = await this.shares();
        return shares.find(s => s.id === id) || null;
    }
    async createShare(input) {
        const share = {
            id: Date.now().toString(),
            ...input,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        // TODO: Send invitation email or generate share link
        if (input.type === share_1.ShareType.LINK) {
            share.url = `https://lifecapsule.app/share/${share.id}`;
            share.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
        }
        return share;
    }
    async child(share) {
        return {
            id: share.childId,
            name: share.childId === 'c1' ? 'Emma' : 'Leo',
            dob: '2019-01-01',
            createdAt: '2019-01-01T00:00:00Z',
            updatedAt: '2019-01-01T00:00:00Z',
        };
    }
};
exports.ShareResolver = ShareResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [share_1.Share]),
    __param(0, (0, type_graphql_1.Arg)('childId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShareResolver.prototype, "shares", null);
__decorate([
    (0, type_graphql_1.Query)(() => share_1.Share, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShareResolver.prototype, "share", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => share_1.Share),
    __param(0, (0, type_graphql_1.Arg)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof share_1.CreateShareInput !== "undefined" && share_1.CreateShareInput) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], ShareResolver.prototype, "createShare", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => child_1.Child),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof share_1.Share !== "undefined" && share_1.Share) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ShareResolver.prototype, "child", null);
exports.ShareResolver = ShareResolver = __decorate([
    (0, type_graphql_1.Resolver)(share_1.Share)
], ShareResolver);
