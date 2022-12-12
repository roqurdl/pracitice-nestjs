import { Field, ObjectType } from '@nestjs/graphql';
import { IsDate, IsNumber } from 'class-validator';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class CoreEntity {
  @PrimaryGeneratedColumn()
  @Field((_) => Number)
  @IsNumber()
  id: number;

  @CreateDateColumn()
  @Field((_) => Date)
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @Field((_) => Date)
  @IsDate()
  updatedAt: Date;
}
