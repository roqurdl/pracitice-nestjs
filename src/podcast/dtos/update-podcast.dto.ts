import { PodcastSearchInput } from './podcast.dto';
import {
  InputType,
  IntersectionType,
  ObjectType,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import { Podcast } from '../entities/podcast.entity';

@InputType({ isAbstract: true })
@ObjectType()
export class UpdatePodcastDto extends IntersectionType(
  PodcastSearchInput,
  PartialType(OmitType(Podcast, ['id', 'episodes'])),
) {}
