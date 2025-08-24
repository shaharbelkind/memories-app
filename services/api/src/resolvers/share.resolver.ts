import { Resolver, Query, Mutation, Arg, FieldResolver, Root } from 'type-graphql';
import { Share, ShareType, CreateShareInput } from '../types/share';
import { Child } from '../types/child';

@Resolver(Share)
export class ShareResolver {
  @Query(() => [Share])
  async shares(@Arg('childId') childId?: string): Promise<Share[]> {
    const shares: Share[] = [
      {
        id: '1',
        childId: 'c1',
        type: ShareType.FAMILY,
        email: 'grandma@example.com',
        role: 'contributor',
        permissions: ['view', 'upload'],
        status: 'active',
        createdAt: '2024-01-15T00:00:00Z',
      },
      {
        id: '2',
        childId: 'c2',
        type: ShareType.LINK,
        url: 'https://lifecapsule.app/share/abc123',
        permissions: ['view'],
        status: 'active',
        expiresAt: '2024-12-31T23:59:59Z',
        createdAt: '2024-02-20T00:00:00Z',
      },
    ];

    return shares.filter(s => !childId || s.childId === childId);
  }

  @Query(() => Share, { nullable: true })
  async share(@Arg('id') id: string): Promise<Share | null> {
    const shares = await this.shares();
    return shares.find(s => s.id === id) || null;
  }

  @Mutation(() => Share)
  async createShare(@Arg('input') input: CreateShareInput): Promise<Share> {
    const share: Share = {
      id: Date.now().toString(),
      ...input,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // TODO: Send invitation email or generate share link
    if (input.type === ShareType.LINK) {
      share.url = `https://lifecapsule.app/share/${share.id}`;
      share.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
    }

    return share;
  }

  @FieldResolver(() => Child)
  async child(@Root() share: Share): Promise<Child> {
    return {
      id: share.childId,
      name: share.childId === 'c1' ? 'Emma' : 'Leo',
      dob: '2019-01-01',
      createdAt: '2019-01-01T00:00:00Z',
      updatedAt: '2019-01-01T00:00:00Z',
    };
  }
}
