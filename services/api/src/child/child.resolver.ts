import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ChildService } from './child.service';
import { MemoryService } from '../memory/memory.service';
import { Child } from './child.entity';
import { MemoryConnection } from '../memory/memory.entity';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => Child)
export class ChildResolver {
  constructor(
    private childService: ChildService,
    private memoryService: MemoryService,
  ) {}

  @Query(() => Child)
  @UseGuards(GqlAuthGuard)
  async child(@Args('id') id: string): Promise<Child> {
    return this.childService.findOne(id);
  }

  @Query(() => [Child])
  @UseGuards(GqlAuthGuard)
  async myChildren(@CurrentUser() user: any): Promise<Child[]> {
    return this.childService.findAll(user.id);
  }

  @Mutation(() => Child)
  @UseGuards(GqlAuthGuard)
  async createChild(
    @Args('name') name: string,
    @Args('dob', { nullable: true }) dob?: string,
    @CurrentUser() user: any,
  ): Promise<Child> {
    return this.childService.create(user.id, name, dob);
  }

  @ResolveField(() => MemoryConnection)
  async timeline(
    @Parent() child: Child,
    @Args('after', { nullable: true }) after?: string,
    @Args('first', { defaultValue: 50 }) first: number,
  ): Promise<MemoryConnection> {
    return this.memoryService.findAll(child.id, after, first);
  }
}
