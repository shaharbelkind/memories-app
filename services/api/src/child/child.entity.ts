import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class Child {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  dob?: string;

  @Field(() => [String], { nullable: true })
  faceClusterIds?: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
