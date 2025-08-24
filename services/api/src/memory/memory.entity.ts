import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';

export enum MemoryKind {
  PHOTO = 'photo',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOC = 'doc',
  SCAN3D = 'scan3d'
}

registerEnumType(MemoryKind, {
  name: 'MemoryKind',
});

@ObjectType()
export class Memory {
  @Field(() => ID)
  id: string;

  @Field(() => MemoryKind)
  kind: MemoryKind;

  @Field()
  url: string;

  @Field({ nullable: true })
  previewUrl?: string;

  @Field({ nullable: true })
  transcript?: string;

  @Field(() => [String])
  tags: string[];

  @Field({ nullable: true })
  takenAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class MemoryEdge {
  @Field()
  cursor: string;

  @Field(() => Memory)
  node: Memory;
}

@ObjectType()
export class MemoryConnection {
  @Field(() => [MemoryEdge])
  edges: MemoryEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}

@ObjectType()
export class PageInfo {
  @Field({ nullable: true })
  endCursor?: string;

  @Field()
  hasNextPage: boolean;
}
