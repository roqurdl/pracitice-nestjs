import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { CoreOutput } from './output.dto';
import { Podcast } from '../entities/podcast.entity';
import { IsNumber } from 'class-validator';
import { Episode } from '../entities/episode.entity';

@InputType()
export class PodcastSearchInput {
  @Field((type) => Number)
  @IsNumber()
  id: number;
}

@InputType()
export class EpisodesSearchInput {
  @Field((type) => Number)
  @IsNumber()
  podcastId: number;

  @Field((type) => Number)
  @IsNumber()
  episodeId: number;
}
