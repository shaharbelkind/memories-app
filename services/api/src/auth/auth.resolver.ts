import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { CurrentUser } from './current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<string> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const result = await this.authService.login(user);
    return result.access_token;
  }

  @Mutation(() => String)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string,
  ): Promise<string> {
    const user = await this.authService.register(email, password, name);
    const result = await this.authService.login(user);
    return result.access_token;
  }

  @Query(() => String)
  @UseGuards(GqlAuthGuard)
  getProfile(@CurrentUser() user: any) {
    return user.email;
  }
}
