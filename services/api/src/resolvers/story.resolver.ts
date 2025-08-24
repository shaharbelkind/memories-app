import { Resolver, Query, Mutation, Arg, FieldResolver, Root } from 'type-graphql';
import { Story, StoryType, StoryStatus, GenerateStoryInput } from '../types/story';
import { Child } from '../types/child';

@Resolver(Story)
export class StoryResolver {
  @Query(() => [Story])
  async stories(
    @Arg('childId') childId?: string,
    @Arg('type') type?: string
  ): Promise<Story[]> {
    const stories: Story[] = [
      {
        id: '1',
        childId: 'c1',
        type: StoryType.ANNUAL_FILM,
        title: 'Emma\'s 2024 Year in Review',
        status: StoryStatus.COMPLETED,
        year: 2024,
        duration: 120,
        url: 'https://example.com/stories/1.mp4',
        createdAt: '2024-12-31T00:00:00Z',
      },
      {
        id: '2',
        childId: 'c2',
        type: StoryType.STORYBOOK,
        title: 'Leo\'s First Steps Story',
        status: StoryStatus.COMPLETED,
        url: 'https://example.com/stories/2.pdf',
        createdAt: '2024-02-20T00:00:00Z',
      },
    ];

    return stories.filter(s => 
      (!childId || s.childId === childId) && 
      (!type || s.type === type)
    );
  }

  @Query(() => Story, { nullable: true })
  async story(@Arg('id') id: string): Promise<Story | null> {
    const stories = await this.stories();
    return stories.find(s => s.id === id) || null;
  }

  @Mutation(() => Story)
  async generateStory(@Arg('input') input: GenerateStoryInput): Promise<Story> {
    const story: Story = {
      id: Date.now().toString(),
      ...input,
      status: StoryStatus.PROCESSING,
      createdAt: new Date().toISOString(),
    };

    // TODO: Enqueue story generation job
    // await storyQueue.add('generate', { ...input, storyId: story.id });

    return story;
  }

  @FieldResolver(() => Child)
  async child(@Root() story: Story): Promise<Child> {
    return {
      id: story.childId,
      name: story.childId === 'c1' ? 'Emma' : 'Leo',
      dob: '2019-01-01',
      createdAt: '2019-01-01T00:00:00Z',
      updatedAt: '2019-01-01T00:00:00Z',
    };
  }
}
