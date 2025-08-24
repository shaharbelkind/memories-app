import { Injectable } from '@nestjs/common';
import { Child } from './child.entity';

@Injectable()
export class ChildService {
  private children: Child[] = [
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

  async findAll(userId: string): Promise<Child[]> {
    return this.children;
  }

  async findOne(id: string): Promise<Child> {
    const child = this.children.find(c => c.id === id);
    if (!child) {
      throw new Error('Child not found');
    }
    return child;
  }

  async create(userId: string, name: string, dob?: string): Promise<Child> {
    const child: Child = {
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

  async update(id: string, updates: Partial<Child>): Promise<Child> {
    const child = this.children.find(c => c.id === id);
    if (!child) {
      throw new Error('Child not found');
    }

    Object.assign(child, updates, { updatedAt: new Date() });
    return child;
  }
}
