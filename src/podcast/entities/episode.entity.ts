import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { IsString, IsNumber } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@InputType('EpisodeInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Episode {
  @Field((_) => Number)
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Field((_) => String)
  @Column()
  @IsString()
  title: string;

  @Field((_) => String)
  @Column()
  @IsString()
  category: string;
}
