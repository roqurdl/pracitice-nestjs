import { Module } from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { PodcastResolver, EpisodeResolver } from './podcast.resolver';

@Module({
  providers: [PodcastService, PodcastResolver, EpisodeResolver],
})
export class PodcastsModule {}
