import {
  InputType,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Episode } from '../entities/episode.entity';
import { EpisodesSearchInput } from './podcast.dto';

@InputType()
export class UpdateEpisodeDto extends IntersectionType(
  EpisodesSearchInput,
  PartialType(PickType(Episode, ['title', 'category'] as const)),
) {}
