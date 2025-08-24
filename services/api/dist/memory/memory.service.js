"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryService = void 0;
const common_1 = require("@nestjs/common");
const memory_entity_1 = require("./memory.entity");
let MemoryService = class MemoryService {
    memories = [
        {
            id: '1',
            kind: memory_entity_1.MemoryKind.PHOTO,
            url: 'https://via.placeholder.com/400x300',
            previewUrl: 'https://via.placeholder.com/200x150',
            transcript: '',
            tags: ['family', 'birthday'],
            takenAt: new Date('2024-01-15'),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: '2',
            kind: memory_entity_1.MemoryKind.VIDEO,
            url: 'https://via.placeholder.com/400x300',
            previewUrl: 'https://via.placeholder.com/200x150',
            transcript: 'First steps! Look at that smile.',
            tags: ['first-steps', 'milestone'],
            takenAt: new Date('2024-02-20'),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];
    async findAll(childId, after, first = 50) {
        const filteredMemories = this.memories.filter(m => m.id !== after);
        const edges = filteredMemories.slice(0, first).map(memory => ({
            cursor: memory.id,
            node: memory,
        }));
        const pageInfo = {
            endCursor: edges[edges.length - 1]?.cursor,
            hasNextPage: filteredMemories.length > first,
        };
        return { edges, pageInfo };
    }
    async findOne(id) {
        const memory = this.memories.find(m => m.id === id);
        if (!memory) {
            throw new Error('Memory not found');
        }
        return memory;
    }
    async create(childId, kind, file) {
        const memory = {
            id: Date.now().toString(),
            kind,
            url: 'https://via.placeholder.com/400x300',
            previewUrl: 'https://via.placeholder.com/200x150',
            transcript: '',
            tags: [],
            takenAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.memories.push(memory);
        return memory;
    }
    async search(childId, query, topK = 20) {
        const searchTerm = query.toLowerCase();
        return this.memories
            .filter(memory => memory.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            memory.transcript?.toLowerCase().includes(searchTerm))
            .slice(0, topK);
    }
};
exports.MemoryService = MemoryService;
exports.MemoryService = MemoryService = __decorate([
    (0, common_1.Injectable)()
], MemoryService);
