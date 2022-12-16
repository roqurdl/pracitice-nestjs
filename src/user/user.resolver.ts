import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/user-auth.decorator';
import { CreateUserInput, CreateUserOutput } from './dtos/user-create.dto';
import { LoginUserInput, LoginUserOutput } from './dtos/user-login.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation((returns) => CreateUserOutput)
  async createUser(@Args(`input`) createUserInput: CreateUserInput) {
    try {
      const { ok, error } = await this.userService.createUser(createUserInput);
      return {
        ok,
        error,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
  //login
  @Mutation((returns) => LoginUserOutput)
  async login(
    @Args(`input`) loginInput: LoginUserInput,
  ): Promise<LoginUserOutput> {
    try {
      const { ok, error, token } = await this.userService.login(loginInput);
      return {
        ok,
        error,
        token,
      };
    } catch (error) {
      return {
        error,
        ok: false,
      };
    }
  }
  //Auth
  @Query((returns) => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser) {
    return authUser;
  }
  //seeProfile
  @Mutation((returns) => UserProfileOutput)
  async userProfile(@Args() userProfileInput: UserProfileInput) {
    try {
      const user = await this.userService.findById(userProfileInput.userId);
      if (!user) {
        throw Error();
      }
      return {
        ok: true,
        user,
      };
    } catch (e) {
      return {
        ok: false,
        error: `There is no User Id: ${userProfileInput.userId}`,
      };
    }
  }
  //editProfile
}
