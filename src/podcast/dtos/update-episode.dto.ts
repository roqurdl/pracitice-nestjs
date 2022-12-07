import { InputType, PickType } from '@nestjs/graphql';
import { Episode } from '../entities/episode.entity';

@InputType()
export class UpdateEpisodeDto extends PickType(Episode, [
  `title`,
  `category`,
  `rating`,
]) {}
