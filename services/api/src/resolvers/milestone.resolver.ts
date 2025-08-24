import { Args, Field, ID, ObjectType, Query, Mutation, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma.service';

@ObjectType() class MilestoneGQL { @Field(()=>ID) id!: string; @Field() title!: string; @Field({nullable:true}) date?: string; @Field() score!: number; @Field(()=>[String]) missing!: string[] }

function computeCompleteness(meta:any){
  const required = meta.required || ['voice','art','clip','photo'];
  const present = new Set(meta.present || []);
  const missing = required.filter((r:string)=> !present.has(r));
  const score = Math.round(((required.length - missing.length)/required.length)*100);
  return { score, missing };
}

@Resolver()
export class MilestoneResolver {
  constructor(private prisma: PrismaService){}

  @Query(()=>[MilestoneGQL])
  async milestones(@Args('childId') childId: string){
    const list = await this.prisma.milestone.findMany({ where:{ childId }, orderBy:{ createdAt:'desc' } });
    return list.map(m=> { const c = computeCompleteness(m.completeness); return { id:m.id, title:m.title, date:m.date?.toISOString(), score:c.score, missing:c.missing }; });
  }

  @Mutation(()=>MilestoneGQL)
  async upsertMilestone(@Args('childId') childId: string, @Args('title') title: string, @Args('date', {nullable:true}) date?: string){
    const ms = await this.prisma.milestone.upsert({ where:{ childId_title:{ childId, title } as any }, update:{ date: date? new Date(date): undefined }, create:{ childId, title, date: date? new Date(date): undefined, completeness:{ required:['voice','art','clip','photo'], present:[] } as any } });
    const c = computeCompleteness(ms.completeness);
    return { id: ms.id, title: ms.title, date: ms.date?.toISOString(), score: c.score, missing: c.missing };
  }

  @Mutation(()=>Boolean)
  async markArtifactPresent(@Args('milestoneId') milestoneId: string, @Args('kind') kind: string){
    const ms = await this.prisma.milestone.findUnique({ where:{ id: milestoneId } });
    const comp = (ms?.completeness as any) || { required:['voice','art','clip','photo'], present:[] };
    if(!comp.present.includes(kind)) comp.present.push(kind);
    await this.prisma.milestone.update({ where:{ id: milestoneId }, data:{ completeness: comp as any } });
    return true;
  }
}
