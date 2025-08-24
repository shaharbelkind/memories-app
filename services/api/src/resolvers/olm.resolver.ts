import { Args, Field, ID, ObjectType, Query, Mutation, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma.service';
import { S3Service } from '../s3.service';

@ObjectType()
class ARObjectGQL {
  @Field(()=>ID) id!: string;
  @Field() label!: string;
  @Field({nullable:true}) previewUrl?: string;
  @Field({nullable:true}) meshUrl?: string;
}

@Resolver()
export class OLMResolver {
  constructor(private prisma: PrismaService, private s3: S3Service){}

  @Query(()=>[ARObjectGQL])
  async arObjects(@Args('childId') childId: string){
    const list = await this.prisma.aRObject.findMany({ where:{ childId } });
    const results: ARObjectGQL[] = [];
    for(const o of list){
      results.push({
        id: o.id,
        label: o.label,
        previewUrl: o.previewKey ? await this.s3.presignGet(o.previewKey) : undefined,
        meshUrl: o.meshKey ? await this.s3.presignGet(o.meshKey) : undefined,
      });
    }
    return results;
  }

  @Mutation(()=>ARObjectGQL)
  async createARObject(@Args('childId') childId: string, @Args('label') label: string){
    const obj = await this.prisma.aRObject.create({ data: { childId, label } });
    return { id: obj.id, label: obj.label } as ARObjectGQL;
  }

  @Mutation(()=>Boolean)
  async linkMemoryToObject(@Args('objectId') objectId: string, @Args('memoryId') memoryId: string){
    await this.prisma.aRLink.create({ data:{ objectId, memoryId } });
    return true;
  }
}
