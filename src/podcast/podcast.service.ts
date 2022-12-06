import { Injectable, NotFoundException } from '@nestjs/common';
import { isDeepStrictEqual } from 'util';
import { EpisodeDto } from './dtos/create-episode.dto';
import { PodcastDto } from './dtos/create-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';

@Injectable()
export class PodcastService {
  private podcasts: Podcast[] = [];
  private episodes: Episode[] = [];

  getAllPod(): Podcast[] {
    return this.podcasts;
  }
  getPod(id: number): Podcast {
    const podcast = this.podcasts.find((pod) => pod.id === +id);
    if (!podcast) {
      throw new NotFoundException(`Podcast ID:${id} is not exists`);
    }
    return podcast;
  }
  createPod(podData: PodcastDto) {
    this.podcasts.push({
      id: this.podcasts.length + 1,
      episodes: [],
      ...podData,
    });
  }
  deletePod(id: number) {
    this.getPod(id);
    this.podcasts = this.podcasts.filter((podcast) => podcast.id !== +id);
  }
  updatePod(id: number, updatePodData: PodcastDto) {
    const podcast = this.getPod(id);
    this.deletePod(id);
    this.podcasts.push({ ...podcast, ...updatePodData });
  }
  getEp(podId: number) {
    const podcast = this.getPod(podId);
    return podcast.episodes;
  }
  createEp(podId: number, epiData: EpisodeDto) {
    const podEpies = this.episodes.filter((episode) => episode.podId === podId);
    this.episodes.push({
      epId: podEpies.length + 1,
      podId,
      ...epiData,
    });
    const podEpisodes = this.episodes.filter(
      (episode) => episode.podId === podId,
    );
    const podcast = this.getPod(podId);
    this.updatePod(podId, { ...podcast, episodes: podEpisodes });
  }
  updateEp(ids: { id: number; episodeId: number }, epiData: EpisodeDto) {
    const podcast = this.getPod(ids.id);
    let episodes = this.getEp(ids.id);
    const episode = episodes.filter(
      (epi) => epi.epId === Number(ids.episodeId),
    );
    this.deleteEp(ids);
    episodes = episodes.filter((epi) => epi.epId !== Number(ids.episodeId));
    this.episodes.filter((epi) => epi.epId !== Number(ids.episodeId));
    episodes.push({ ...episode[0], ...epiData });
    this.episodes.push({ ...episode[0], ...epiData });
    podcast.episodes = episodes;
    this.updatePod(ids.id, podcast);
  }
  deleteEp({ id, episodeId }: { id: number; episodeId: number }) {
    const podcast = this.getPod(id);
    let episodes = this.getEp(id);
    episodes = episodes.filter((episode) => episode.epId !== +episodeId);
    this.episodes.filter((episode) => episode.epId !== +episodeId);
    podcast.episodes = episodes;
    this.updatePod(id, podcast);
  }
}
