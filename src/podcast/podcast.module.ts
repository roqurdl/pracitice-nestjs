import { Module } from '@nestjs/common';
import { EpisodeController, PodcastsController } from './podcast.controller';
import { PodcastsService } from './podcast.service';

@Module({
  controllers: [PodcastsController, EpisodeController],
  providers: [PodcastsService],
})
export class PodcastsModule {}
