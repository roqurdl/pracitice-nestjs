import { InputType, IntersectionType, PickType } from '@nestjs/graphql';
import { PodcastSearchInput } from './podcast.dto';
import { Episode } from '../entities/episode.entity';
@InputType()
export class CreateEpisodeDto extends IntersectionType(
  PodcastSearchInput,
  PickType(Episode, ['title', 'category'] as const),
) {}
