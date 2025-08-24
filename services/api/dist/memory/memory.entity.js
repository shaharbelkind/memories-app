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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageInfo = exports.MemoryConnection = exports.MemoryEdge = exports.Memory = exports.MemoryKind = void 0;
const graphql_1 = require("@nestjs/graphql");
var MemoryKind;
(function (MemoryKind) {
    MemoryKind["PHOTO"] = "photo";
    MemoryKind["VIDEO"] = "video";
    MemoryKind["AUDIO"] = "audio";
    MemoryKind["DOC"] = "doc";
    MemoryKind["SCAN3D"] = "scan3d";
})(MemoryKind || (exports.MemoryKind = MemoryKind = {}));
(0, graphql_1.registerEnumType)(MemoryKind, {
    name: 'MemoryKind',
});
let Memory = class Memory {
    id;
    kind;
    url;
    previewUrl;
    transcript;
    tags;
    takenAt;
    createdAt;
    updatedAt;
};
exports.Memory = Memory;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Memory.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => MemoryKind),
    __metadata("design:type", String)
], Memory.prototype, "kind", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Memory.prototype, "url", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Memory.prototype, "previewUrl", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Memory.prototype, "transcript", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], Memory.prototype, "tags", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], Memory.prototype, "takenAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Memory.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Memory.prototype, "updatedAt", void 0);
exports.Memory = Memory = __decorate([
    (0, graphql_1.ObjectType)()
], Memory);
let MemoryEdge = class MemoryEdge {
    cursor;
    node;
};
exports.MemoryEdge = MemoryEdge;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], MemoryEdge.prototype, "cursor", void 0);
__decorate([
    (0, graphql_1.Field)(() => Memory),
    __metadata("design:type", Memory)
], MemoryEdge.prototype, "node", void 0);
exports.MemoryEdge = MemoryEdge = __decorate([
    (0, graphql_1.ObjectType)()
], MemoryEdge);
let MemoryConnection = class MemoryConnection {
    edges;
    pageInfo;
};
exports.MemoryConnection = MemoryConnection;
__decorate([
    (0, graphql_1.Field)(() => [MemoryEdge]),
    __metadata("design:type", Array)
], MemoryConnection.prototype, "edges", void 0);
__decorate([
    (0, graphql_1.Field)(() => PageInfo),
    __metadata("design:type", PageInfo)
], MemoryConnection.prototype, "pageInfo", void 0);
exports.MemoryConnection = MemoryConnection = __decorate([
    (0, graphql_1.ObjectType)()
], MemoryConnection);
let PageInfo = class PageInfo {
    endCursor;
    hasNextPage;
};
exports.PageInfo = PageInfo;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PageInfo.prototype, "endCursor", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PageInfo.prototype, "hasNextPage", void 0);
exports.PageInfo = PageInfo = __decorate([
    (0, graphql_1.ObjectType)()
], PageInfo);
