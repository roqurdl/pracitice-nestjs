import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEmail, IsEnum } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core.entity';
import { Entity, Column } from 'typeorm';

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
}
