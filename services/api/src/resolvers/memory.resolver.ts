import { Args, Field, ID, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma.service';

@ObjectType()
class Memory {
  @Field(() => ID) id!: string;
  @Field() kind!: string;
  @Field() url!: string;
  @Field({nullable:true}) takenAt?: string;
}

@Resolver(() => Memory)
export class MemoryResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [Memory])
  async memories(@Args('childId') childId: string){
    return this.prisma.memory.findMany({ where: { childId }, orderBy: { createdAt: 'desc' } });
  }

  @Mutation(() => Memory)
  async attachUploadedFile(
    @Args('memoryId') memoryId: string,
    @Args('publicUrl') publicUrl: string
  ){
    return this.prisma.memory.update({ where: { id: memoryId }, data: { url: publicUrl } });
  }
}
