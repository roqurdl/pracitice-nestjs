import { Module } from '@nestjs/common';
import { EpisodeController, PodcastsController } from './podcast.controller';
import { PodcastResolver } from './podcast.resolver';
import { PodcastsService } from './podcast.service';

@Module({
  controllers: [PodcastsController, EpisodeController],
  providers: [PodcastsService, PodcastResolver],
})
export class PodcastsModule {}
