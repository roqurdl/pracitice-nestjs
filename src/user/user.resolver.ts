import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/user-auth.decorator';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
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
    return await this.userService.createUser(createUserInput);
  }
  //login
  @Mutation((returns) => LoginUserOutput)
  async login(
    @Args(`input`) loginInput: LoginUserInput,
  ): Promise<LoginUserOutput> {
    return await this.userService.login(loginInput);
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
    return await this.userService.findById(userProfileInput.userId);
  }
  //editProfile
  @Mutation((returns) => EditProfileOutput)
  async editProfile(
    @AuthUser() authUser: User,
    @Args(`input`) editProfileInput: EditProfileInput,
  ) {
    return this.userService.editProfile(authUser.id, editProfileInput);
  }
}
