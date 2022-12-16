import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}
  async createUser({ email, password, role }: CreateUserInput) {
    try {
      const exist = await this.user.findOneBy({ email });
      if (exist) {
        return {
          ok: false,
          error: `The Email is already exist.`,
        };
      }
      await this.user.save(this.user.create({ email, password, role }));
    } catch (error) {
      return {
        ok: false,
        error: `Should not create User Account.`,
      };
    }
  }
}
