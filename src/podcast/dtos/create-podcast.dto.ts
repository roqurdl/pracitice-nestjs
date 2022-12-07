import { Episode } from '../entities/episode.entity';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePodcastDto {
  @Field((type) => String)
  title: string;
  @Field((type) => String)
  category: string;
  @Field((type) => Number)
  rating: number;
  @Field((type) => [Episode])
  episodes: Episode[];
}
