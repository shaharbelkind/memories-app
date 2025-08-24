import { Args, Field, ID, ObjectType, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma.service';
import { S3Service } from '../s3.service';
import IORedis from 'ioredis';
import { Queue } from 'bullmq';

@ObjectType() class YearbookJob { @Field(()=>ID) id!: string }
@ObjectType() class YearbookOut { @Field() url!: string }

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
const renderQueue = new Queue('render', { connection });

@Resolver()
export class YearbookResolver {
  constructor(private prisma: PrismaService, private s3: S3Service){}

  @Mutation(()=>YearbookJob)
  async createYearbook(@Args('childId') childId: string){
    const child = await this.prisma.child.findUnique({ where:{ id: childId } });
    const images = (await this.prisma.memory.findMany({ where:{ childId, kind:'PHOTO' }, take: 80, orderBy:{ createdAt:'desc' } })).map(m=> m.url || m.s3ProcKey || m.s3RawKey || '');
    const job = await renderQueue.add('yearbook', { childName: child?.name || 'Child', images });
    return { id: job.id };
  }

  @Query(()=>YearbookOut)
  async getYearbook(@Args('jobId') jobId: string){
    const job = await renderQueue.getJob(jobId);
    if(!job) throw new Error('Job not found');
    const state = await job.getState();
    const res:any = state === 'completed' ? job.returnvalue : null;
    if(!res?.key) throw new Error('Not ready');
    const url = await this.s3.presignGet(res.key);
    return { url };
  }
}
