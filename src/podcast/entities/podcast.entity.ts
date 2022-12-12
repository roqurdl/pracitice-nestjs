import { Episode } from './episode.entity';
import { ObjectType, Field } from '@nestjs/graphql';
import { IsString, IsNumber } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
@ObjectType()
export class Podcast {
  @PrimaryGeneratedColumn()
  @Field((_) => Number)
  @IsNumber()
  id: number;

  @Column()
  @Field((_) => String)
  @IsString()
  title: string;

  @Field((_) => String)
  @IsString()
  category: string;

  @Column()
  @Field((_) => Number)
  @IsNumber()
  rating: number;

  @Column(`simple-array`)
  @Field((_) => [Episode])
  episodes: Episode[];
}
