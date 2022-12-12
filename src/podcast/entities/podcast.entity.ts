import { Episode } from './episode.entity';
import {
  ObjectType,
  Field,
  InputType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsString, IsNumber } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';

enum PodcastCategory {
  COMEDY = 'COMEDY',
  ENTERTAINMENT = 'ENTERTAINMENT',
  EDUCATION = 'EDUCATION',
  NEWS = 'NEWS',
  BUSINESS = 'BUSINESS',
  FITNESS = 'FITNESS',
}

registerEnumType(PodcastCategory, { name: 'PodcastCategory' });
@InputType('PodcastInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Podcast extends CoreEntity {
  @Column()
  @Field((_) => String)
  @IsString()
  title: string;

  @Column()
  @Field((_) => PodcastCategory)
  @IsString()
  category: PodcastCategory;

  @Column()
  @Field((_) => Number)
  @IsNumber()
  rating: number;

  @Field((_) => [Episode], { nullable: true })
  @OneToMany(() => Episode, (episode) => episode.podcast, {
    cascade: true,
  })
  episodes: Episode[];
}
