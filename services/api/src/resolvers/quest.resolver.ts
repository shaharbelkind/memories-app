import { Args, Field, ID, ObjectType, Mutation, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma.service';

@ObjectType() class QuestGQL { @Field(()=>ID) id!: string; @Field() month!: number; @Field() year!: number; @Field() target!: number; @Field() status!: string }

@Resolver()
export class QuestResolver {
  constructor(private prisma: PrismaService){}

  @Mutation(()=>QuestGQL)
  async ensureMonthlyQuest(@Args('childId') childId: string, @Args('month') month: number, @Args('year') year: number, @Args('target',{defaultValue:5}) target:number){
    const q = await this.prisma.quest.upsert({ where:{ childId_month_year:{ childId, month, year } as any }, update:{}, create:{ childId, month, year, target } });
    return q as any;
  }

  @Mutation(()=>Boolean)
  async pickFavorite(@Args('questId') questId: string, @Args('memoryId') memoryId: string){
    const q = await this.prisma.quest.findUnique({ where:{ id: questId }, include:{ picks:true } });
    if(!q) return false; if(q.picks.length >= q.target) return false;
    await this.prisma.questPick.create({ data:{ questId, memoryId } });
    const picks = await this.prisma.questPick.count({ where:{ questId } });
    if(picks >= q.target) await this.prisma.quest.update({ where:{ id: questId }, data:{ status:'DONE' } });
    return true;
  }
}
