import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  role: string;

  @Field({ nullable: true })
  region?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
