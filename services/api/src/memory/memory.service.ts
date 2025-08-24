import { Injectable } from '@nestjs/common';
import { Memory, MemoryKind, MemoryConnection, MemoryEdge, PageInfo } from './memory.entity';

@Injectable()
export class MemoryService {
  private memories: Memory[] = [
    {
      id: '1',
      kind: MemoryKind.PHOTO,
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
      kind: MemoryKind.VIDEO,
      url: 'https://via.placeholder.com/400x300',
      previewUrl: 'https://via.placeholder.com/200x150',
      transcript: 'First steps! Look at that smile.',
      tags: ['first-steps', 'milestone'],
      takenAt: new Date('2024-02-20'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  async findAll(childId: string, after?: string, first: number = 50): Promise<MemoryConnection> {
    const filteredMemories = this.memories.filter(m => m.id !== after);
    const edges: MemoryEdge[] = filteredMemories.slice(0, first).map(memory => ({
      cursor: memory.id,
      node: memory,
    }));

    const pageInfo: PageInfo = {
      endCursor: edges[edges.length - 1]?.cursor,
      hasNextPage: filteredMemories.length > first,
    };

    return { edges, pageInfo };
  }

  async findOne(id: string): Promise<Memory> {
    const memory = this.memories.find(m => m.id === id);
    if (!memory) {
      throw new Error('Memory not found');
    }
    return memory;
  }

  async create(childId: string, kind: MemoryKind, file: any): Promise<Memory> {
    const memory: Memory = {
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

  async search(childId: string, query: string, topK: number = 20): Promise<Memory[]> {
    const searchTerm = query.toLowerCase();
    return this.memories
      .filter(memory => 
        memory.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        memory.transcript?.toLowerCase().includes(searchTerm)
      )
      .slice(0, topK);
  }
}
