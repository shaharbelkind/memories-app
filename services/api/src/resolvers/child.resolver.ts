import { Args, Field, ID, InputType, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma.service';

@ObjectType()
class Child { @Field(() => ID) id!: string; @Field() name!: string; @Field({nullable:true}) dob?: string }

@InputType()
class ChildInput { @Field() name!: string; @Field({nullable:true}) dob?: string }

@Resolver(() => Child)
export class ChildResolver {
  constructor(private prisma: PrismaService) {}
  @Query(() => [Child]) async children(){ return this.prisma.child.findMany(); }
  @Query(() => Child, { nullable: true }) async child(@Args('id') id: string){ return this.prisma.child.findUnique({ where: { id } }); }
  @Mutation(() => Child)
  async createChild(@Args('input') input: ChildInput){
    return this.prisma.child.create({ data: { name: input.name, dob: input.dob? new Date(input.dob): undefined } });
  }
}
