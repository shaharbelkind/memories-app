import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class HelloResolver {
  @Query(() => String)
  hello(): string {
    return 'Life Story Capsule API is running';
  }
}


