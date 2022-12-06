import { Module } from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { PodcastController } from './podcast.controller';

@Module({
  providers: [PodcastService],
  controllers: [PodcastController]
})
export class PodcastModule {}
