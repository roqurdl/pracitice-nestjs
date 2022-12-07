import { Episode } from '../entities/episode.entity';

export class CreatePodcastDto {
  readonly title: string;
  readonly category: string;
  readonly rating: number;
  readonly episodes: Episode[];
}
