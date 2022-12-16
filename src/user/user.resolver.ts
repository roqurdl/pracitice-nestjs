import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
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
}
