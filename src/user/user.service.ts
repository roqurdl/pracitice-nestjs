import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dtos/user-create.dto';
import { LoginUserInput, LoginUserOutput } from './dtos/user-login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}
  async createUser({
    email,
    password,
    role,
  }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      const exist = await this.users.findOneBy({ email });
      if (exist) {
        return {
          ok: false,
          error: `The Email is already exist.`,
        };
      }
      await this.users.save(this.users.create({ email, password, role }));
    } catch (error) {
      return {
        ok: false,
        error: `Should not create User Account.`,
      };
    }
  }
  async login({ email, password }: LoginUserInput): Promise<LoginUserOutput> {
    try {
      const user = await this.users.findOneBy({ email });
      if (!user) {
        return { ok: false, error: `User is not found.` };
      }
      const hashCheck = await user.hashCheck(password);
      if (!hashCheck) {
        return { ok: false, error: `You enter the Wrong Password` };
      }
    } catch (error) {
      return { ok: false, error };
    }
  }
}
