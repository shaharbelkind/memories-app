import { Resolver, Query, Mutation, Arg, FieldResolver, Root } from 'type-graphql';
import { ARObject, ARObjectStatus, CreateARObjectInput } from '../types/ar-object';
import { Child } from '../types/child';
import { Memory } from '../types/memory';

@Resolver(ARObject)
export class ARObjectResolver {
  @Query(() => [ARObject])
  async arObjects(@Arg('childId') childId?: string): Promise<ARObject[]> {
    const arObjects: ARObject[] = [
      {
        id: '1',
        childId: 'c1',
        name: 'Emma\'s First Teddy Bear',
        meshUrl: 'https://example.com/ar/teddy.glb',
        previewUrl: 'https://picsum.photos/200x150?1',
        linkedMemoryIds: ['m1'],
        status: ARObjectStatus.COMPLETED,
        createdAt: '2024-01-15T00:00:00Z',
      },
      {
        id: '2',
        childId: 'c2',
        name: 'Leo\'s Building Blocks',
        meshUrl: 'https://example.com/ar/blocks.glb',
        previewUrl: 'https://picsum.photos/200x150?2',
        linkedMemoryIds: ['m2'],
        status: ARObjectStatus.COMPLETED,
        createdAt: '2024-02-20T00:00:00Z',
      },
    ];

    return arObjects.filter(obj => !childId || obj.childId === childId);
  }

  @Query(() => ARObject, { nullable: true })
  async arObject(@Arg('id') id: string): Promise<ARObject | null> {
    const arObjects = await this.arObjects();
    return arObjects.find(obj => obj.id === id) || null;
  }

  @Mutation(() => ARObject)
  async createARObject(@Arg('input') input: CreateARObjectInput): Promise<ARObject> {
    const arObject: ARObject = {
      id: Date.now().toString(),
      ...input,
      meshUrl: 'https://example.com/ar/placeholder.glb',
      previewUrl: 'https://picsum.photos/200x150',
      status: ARObjectStatus.PROCESSING,
      createdAt: new Date().toISOString(),
    };

    // TODO: Enqueue AR object creation job
    // await arQueue.add('create', { ...input, arObjectId: arObject.id });

    return arObject;
  }

  @FieldResolver(() => Child)
  async child(@Root() arObject: ARObject): Promise<Child> {
    return {
      id: arObject.childId,
      name: arObject.childId === 'c1' ? 'Emma' : 'Leo',
      dob: '2019-01-01',
      createdAt: '2019-01-01T00:00:00Z',
      updatedAt: '2019-01-01T00:00:00Z',
    };
  }

  @FieldResolver(() => [Memory])
  async linkedMemories(@Root() arObject: ARObject): Promise<Memory[]> {
    return arObject.linkedMemoryIds.map(id => ({
      id,
      childId: arObject.childId,
      kind: 'PHOTO' as any,
      url: `https://picsum.photos/600/400?${id}`,
      takenAt: arObject.createdAt,
      tags: ['ar-object'],
      createdAt: arObject.createdAt,
      updatedAt: arObject.createdAt,
    }));
  }
}
