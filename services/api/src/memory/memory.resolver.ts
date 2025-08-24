import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MemoryService } from './memory.service';
import { Memory, MemoryKind, MemoryConnection } from './memory.entity';
import { Child } from '../child/child.entity';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => Memory)
export class MemoryResolver {
  constructor(private memoryService: MemoryService) {}

  @Query(() => MemoryConnection)
  @UseGuards(GqlAuthGuard)
  async timeline(
    @Args('childId') childId: string,
    @Args('after', { nullable: true }) after?: string,
    @Args('first', { defaultValue: 50 }) first: number,
  ): Promise<MemoryConnection> {
    return this.memoryService.findAll(childId, after, first);
  }

  @Query(() => [Memory])
  @UseGuards(GqlAuthGuard)
  async searchMemories(
    @Args('childId') childId: string,
    @Args('query') query: string,
    @Args('topK', { defaultValue: 20 }) topK: number,
  ): Promise<Memory[]> {
    return this.memoryService.search(childId, query, topK);
  }

  @Mutation(() => Memory)
  @UseGuards(GqlAuthGuard)
  async uploadMemory(
    @Args('childId') childId: string,
    @Args('file') file: any,
    @Args('kind') kind: MemoryKind,
    @CurrentUser() user: any,
  ): Promise<Memory> {
    return this.memoryService.create(childId, kind, file);
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  async generateAnnualFilm(
    @Args('childId') childId: string,
    @Args('year') year: number,
  ): Promise<string> {
    // TODO: Implement film generation
    return 'job-123';
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  async createARObject(
    @Args('childId') childId: string,
    @Args('photos', { type: () => [String] }) photos: string[],
  ): Promise<string> {
    // TODO: Implement 3D object creation
    return 'ar-object-456';
  }
}
