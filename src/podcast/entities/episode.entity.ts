import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { Podcast } from './podcast.entity';

@InputType('EpisodeInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Episode extends CoreEntity {
  @Column()
  @Field((_) => String, { nullable: true })
  @IsString()
  title: string;

  @Column()
  @Field((_) => String, { nullable: true })
  @IsString()
  category: string;

  @ManyToOne(() => Podcast, (podcast) => podcast.episodes)
  @Field((_) => Podcast)
  podcast: Podcast;
}
