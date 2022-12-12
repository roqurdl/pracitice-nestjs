import { Injectable } from '@nestjs/common';
import { CreateEpisodeDto } from './dtos/create-episode.dto';
import { CreatePodcastDto } from './dtos/create-podcast.dto';
import { UpdateEpisodeDto } from './dtos/update-episode.dto';
import { UpdatePodcastDto } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { CoreOutput } from '../common/dtos/output.dto';
import {
  PodcastOutput,
  EpisodesOutput,
  EpisodesSearchInput,
  PodcastsOutput,
} from './dtos/podcast.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Podcast)
    private readonly podcasts: Repository<Podcast>,
    @InjectRepository(Episode)
    private readonly episodes: Repository<Episode>,
  ) {}

  async getAllPodcasts(): Promise<PodcastsOutput> {
    try {
      const podcasts = await this.podcasts.find({ relations: ['episodes'] });
      return { ok: true, podcasts: podcasts };
    } catch (error) {
      return { ok: false, error: 'something went wrong' };
    }
  }

  async createPodcast({
    title,
    category,
  }: CreatePodcastDto): Promise<CoreOutput> {
    try {
      await this.podcasts.save(
        this.podcasts.create({
          title,
          category,
          rating: 0,
        }),
      );

      return { ok: true, error: null };
    } catch (error) {
      return { ok: false, error: 'podcast not created' };
    }
  }

  async getPodcast(id: number): Promise<PodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne(id, {
        relations: ['episodes'],
      });
      if (!podcast) {
        return {
          ok: false,
          error: `${id} id podcast doesn't exist!`,
        };
      }

      return {
        ok: true,
        podcast,
      };
    } catch (error) {
      return { ok: false, error: 'something went wrong' };
    }
  }

  async deletePodcast(id: number): Promise<CoreOutput> {
    try {
      const { ok, error } = await this.getPodcast(id);
      if (!ok) {
        return { ok, error };
      }
      await this.podcasts.delete(id);
      return { ok };
    } catch (error) {
      return { ok: false, error: 'something went wrong' };
    }
  }

  async updatePodcast({ id, ...rest }: UpdatePodcastDto): Promise<CoreOutput> {
    try {
      const { ok, error, podcast } = await this.getPodcast(id);
      if (!ok) {
        return { ok, error };
      }
      this.podcasts.save({ ...podcast, ...rest });
      return { ok };
    } catch (error) {
      return { ok: false, error: 'something went wrong' };
    }
  }

  async getEpisodes(podcastId: number): Promise<EpisodesOutput> {
    try {
      const { ok, error } = await this.getPodcast(podcastId);
      if (!ok) {
        return { ok, error };
      }
      const episodes = await this.episodes.find({
        where: { podcast: { id: podcastId } },
        order: { id: 1 },
      });

      return { ok: true, episodes: episodes };
    } catch (error) {
      return {
        ok: false,
        error: 'something went wrong',
      };
    }
  }

  async createEpisode({
    id: podcastId,
    title,
    category,
  }: CreateEpisodeDto): Promise<CoreOutput> {
    try {
      const { podcast, ok, error } = await this.getPodcast(podcastId);
      if (!ok) {
        return { ok, error };
      }

      const newEpisode = {
        title,
        category,
        podcast,
      };

      this.episodes.save(this.episodes.create(newEpisode));

      return { ok: true };
    } catch (error) {
      console.log(error);
      return { ok: false, error: 'something went wrong' };
    }
  }

  async deleteEpisode({
    podcastId,
    episodeId,
  }: EpisodesSearchInput): Promise<CoreOutput> {
    try {
      const { podcast, error, ok } = await this.getPodcast(podcastId);
      if (!ok) {
        return { ok, error };
      }
      if (!podcast.episodes.find((ep) => ep.id === episodeId))
        return { ok: false, error: 'episode not exist' };
      await this.episodes.delete(episodeId);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'something went wrong' };
    }
  }

  async updateEpisode({
    podcastId,
    episodeId,
    ...rest
  }: UpdateEpisodeDto): Promise<CoreOutput> {
    try {
      const { error, ok } = await this.getPodcast(podcastId);
      if (!ok) {
        return { ok, error };
      }

      const episode = await this.episodes.findOne(episodeId, {
        where: { podcast: { id: podcastId } },
      });
      if (!episode) return { ok: false, error: 'episode not found' };

      this.episodes.save({ ...episode, ...rest });

      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'something went wrong' };
    }
  }
}
