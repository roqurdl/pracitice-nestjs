import { Field, ObjectType, InputType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Podcast } from '../entities/podcast.entity';
import { IsNumber } from 'class-validator';
import { Episode } from '../entities/episode.entity';

@InputType()
export class PodcastSearchInput extends PickType(Podcast, ['id']) {}

@ObjectType()
export class PodcastsOutput extends CoreOutput {
  @Field((type) => [Podcast], { nullable: true })
  podcasts?: Podcast[];
}
@ObjectType()
export class PodcastOutput extends CoreOutput {
  @Field((type) => Podcast, { nullable: true })
  podcast?: Podcast;
}

@ObjectType()
export class EpisodesOutput extends CoreOutput {
  @Field((type) => [Episode], { nullable: true })
  episodes?: Episode[];
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
