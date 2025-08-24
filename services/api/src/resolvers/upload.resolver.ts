import { Args, Field, Mutation, ObjectType, Resolver } from '@nestjs/graphql';
import { S3Service } from '../s3.service';
import { PrismaService } from '../prisma.service';

@ObjectType()
class Presigned { @Field() url!: string; @Field() key!: string }

@Resolver()
export class UploadResolver {
  constructor(private s3: S3Service, private prisma: PrismaService){}

  @Mutation(() => Presigned)
  async createUploadUrl(
    @Args('childId') childId: string,
    @Args('filename') filename: string,
    @Args('contentType') contentType: string,
    @Args('kind') kind: string
  ){
    // For now, create a mock upload URL that points to a placeholder
    const key = `raw/${childId}/${Date.now()}-${filename}`;
    const mockUrl = `https://picsum.photos/400/300?${Date.now()}`;
    
    // Pre-create Memory row with mock data
    const mem = await this.prisma.memory.create({ 
      data: { 
        childId, 
        kind, 
        url: mockUrl, 
        s3RawKey: key 
      } 
    });
    
    return { url: mockUrl, key: mem.id };
  }
}
