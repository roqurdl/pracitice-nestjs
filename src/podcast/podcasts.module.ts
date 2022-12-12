import { Module } from '@nestjs/common';
import { PodcastsService } from './podcasts.service';
import { PodcastsResolver, EpisodeResolver } from './podcasts.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Podcast } from './entities/podcast.entity';
import { Episode } from './entities/episode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Episode, Podcast])],
  providers: [PodcastsService, PodcastsResolver, EpisodeResolver],
  exports: [PodcastsService],
})
export class PodcastsModule {}
