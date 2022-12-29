import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEmail, IsEnum } from 'class-validator';
import { CoreEntity } from '../../common/entity/core.entity';
import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

enum UserRole {
  Host,
  Listener,
}
registerEnumType(UserRole, { name: `UserRole` });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Column()
  @Field((type) => String)
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 31);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
  async hashCheck(enterPw): Promise<boolean> {
    try {
      const permission = await bcrypt.compare(enterPw, this.password);
      return permission;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
