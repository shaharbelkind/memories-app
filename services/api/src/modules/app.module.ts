import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaService } from '../prisma.service';
import { MemoryResolver } from '../resolvers/memory.resolver';
import { ChildResolver } from '../resolvers/child.resolver';
import { UploadResolver } from '../resolvers/upload.resolver';
import { S3Service } from '../s3.service';
import { OLMResolver } from '../resolvers/olm.resolver';
import { MilestoneResolver } from '../resolvers/milestone.resolver';
import { QuestResolver } from '../resolvers/quest.resolver';
import { ConsentResolver } from '../resolvers/consent.resolver';
import { YearbookResolver } from '../resolvers/yearbook.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      sortSchema: true
    })
  ],
  providers: [PrismaService, S3Service, MemoryResolver, ChildResolver, UploadResolver, OLMResolver, MilestoneResolver, QuestResolver, ConsentResolver, YearbookResolver]
})
export class AppModule {}
