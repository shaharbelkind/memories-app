"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildService = void 0;
const common_1 = require("@nestjs/common");
let ChildService = class ChildService {
    children = [
        {
            id: '1',
            name: 'Emma',
            dob: '2022-03-15',
            faceClusterIds: ['cluster-1'],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: '2',
            name: 'Liam',
            dob: '2020-07-22',
            faceClusterIds: ['cluster-2'],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];
    async findAll(userId) {
        return this.children;
    }
    async findOne(id) {
        const child = this.children.find(c => c.id === id);
        if (!child) {
            throw new Error('Child not found');
        }
        return child;
    }
    async create(userId, name, dob) {
        const child = {
            id: Date.now().toString(),
            name,
            dob,
            faceClusterIds: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.children.push(child);
        return child;
    }
    async update(id, updates) {
        const child = this.children.find(c => c.id === id);
        if (!child) {
            throw new Error('Child not found');
        }
        Object.assign(child, updates, { updatedAt: new Date() });
        return child;
    }
};
exports.ChildService = ChildService;
exports.ChildService = ChildService = __decorate([
    (0, common_1.Injectable)()
], ChildService);
