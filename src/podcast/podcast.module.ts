import { Module } from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { PodcastResolver, EpisodeResolver } from './podcast.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Podcast } from './entities/podcast.entity';
import { Episode } from './entities/episode.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Podcast, Episode])],
  providers: [PodcastService, PodcastResolver, EpisodeResolver],
})
export class PodcastsModule {}
