import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EpisodeDto } from './dtos/create-episode.dto';
import { PodcastDto } from './dtos/create-podcast.dto';
import { PodcastService } from './podcast.service';

@Controller('podcasts')
export class PodcastController {
  constructor(private readonly podService: PodcastService) {}

  @Get()
  getAllPod() {
    return this.podService.getAllPod();
  }
  @Post()
  createPod(@Body() podDate: PodcastDto) {
    return this.podService.createPod(podDate);
  }

  @Get(`/:id`)
  getPod(@Param(`id`) podId: number) {
    return this.podService.getPod(podId);
  }
  @Patch(`/:id`)
  updatePod(@Param(`id`) podId: number, @Body() updatePodData: PodcastDto) {
    return this.podService.updatePod(podId, updatePodData);
  }
  @Delete(`/:id`)
  deletePod(@Param(`id`) podId: number) {
    return this.podService.deletePod(podId);
  }

  @Get(`/:id/episodes`)
  getEp(@Param(`id`) podId: number) {
    return this.podService.getEp(podId);
  }
  @Post(`/:id/episodes`)
  createEp(@Param(`id`) podId: number, @Body() epiData: EpisodeDto) {
    return this.podService.createEp(podId, epiData);
  }
  @Patch(`/:id/episodes/:episodeId`)
  updateEp(
    @Param() ids: { id: number; episodeId: number },
    @Body() epiData: EpisodeDto,
  ) {
    return this.podService.updateEp(ids, epiData);
  }
  @Delete(`/:id/episodes/:episodeId`)
  deleteEp(@Param() ids: { id: number; episodeId: number }) {
    return this.podService.deleteEp(ids);
  }
}
