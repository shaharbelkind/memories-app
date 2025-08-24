import { Args, Field, ID, ObjectType, Mutation, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma.service';

@ObjectType() class ConsentOut { @Field(()=>ID) id!: string; @Field() status!: string }

@Resolver()
export class ConsentResolver {
  constructor(private prisma: PrismaService){}

  @Mutation(()=>ConsentOut)
  async requestConsent(@Args('childId') childId: string, @Args('shareId') shareId: string){
    const c = await this.prisma.consent.create({ data:{ childId, shareId, status:'PENDING' } });
    return { id:c.id, status:c.status };
  }

  @Mutation(()=>ConsentOut)
  async respondConsent(@Args('consentId') consentId: string, @Args('approve') approve: boolean){
    const c = await this.prisma.consent.update({ where:{ id: consentId }, data:{ status: approve? 'APPROVED':'REJECTED' } });
    return { id: c.id, status: c.status };
  }
}
