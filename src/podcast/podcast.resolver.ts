import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { CreatePodcastDto } from './dtos/create-podcast.dto';
import { Podcast } from './entities/podcast.entity';
import { PodcastsService } from './podcast.service';

@Resolver((of) => Podcast)
export class PodcastResolver {
  constructor(private readonly podcastsService: PodcastsService) {}
  @Query((_) => Podcast)
  getAllPodcasts(): { podcasts: Podcast[]; err: string | null } {
    return this.podcastsService.getAllPodcasts();
  }

  @Mutation((_) => Boolean)
  createPodcast(@Args(`in`) createPodcast: CreatePodcastDto) {}
}
