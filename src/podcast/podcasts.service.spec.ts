import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { PodcastsService } from './podcasts.service';

type mockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = {
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
  delete: jest.fn(),
};

describe(`PodcastsService`, () => {
  let service: PodcastsService;
  let podcastRepository: mockRepository<Podcast>;
  let episodeRepository: mockRepository<Episode>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PodcastsService,
        { provide: getRepositoryToken(Podcast), useValue: mockRepository },
        { provide: getRepositoryToken(Episode), useValue: mockRepository },
      ],
    }).compile();
    service = module.get<PodcastsService>(PodcastsService);
    podcastRepository = module.get(getRepositoryToken(Podcast));
    episodeRepository = module.get(getRepositoryToken(Episode));
  });
  it(`should be defined`, () => {
    expect(service).toBeDefined();
  });
  describe(`getAllPodcasts`, () => {
    it(`should return podcasts array`, async () => {
      podcastRepository.find.mockResolvedValue([`testPod1`, `testPod2`]);
      const result = await service.getAllPodcasts();
      expect(result).toEqual({ ok: true, podcasts: expect.any(Array) });
    });
    it(`should fail to find podcasts array`, async () => {
      podcastRepository.find.mockResolvedValue(undefined);
      const result = await service.getAllPodcasts();
      expect(result).toEqual({
        ok: false,
        error: `Could not find any podcast`,
      });
    });
  });
  describe(`createPodcast`, () => {
    const createPodcastArgs = {
      title: `test-title`,
      category: `test-category`,
    };
    it(`should create Podcast`, async () => {
      podcastRepository.create.mockReturnValue(createPodcastArgs);
      podcastRepository.save.mockResolvedValue({ id: 1 });
      const result = await service.createPodcast(createPodcastArgs);

      expect(podcastRepository.create).toHaveBeenCalled();
      expect(podcastRepository.create).toHaveBeenCalledWith(createPodcastArgs);
      expect(podcastRepository.save).toHaveBeenCalled();
      expect(podcastRepository.save).toHaveBeenCalledWith(createPodcastArgs);
      expect(result).toEqual({
        ok: true,
        id: 1,
      });
    });
    it(`Fail to create Podcast`, async () => {
      podcastRepository.create.mockResolvedValue(new Error());
      podcastRepository.save.mockResolvedValue(new Error());
      const result = await service.createPodcast(createPodcastArgs);
      expect(result).toEqual({
        error: 'Internal server error occurred.',
        ok: false,
      });
    });
  });

  describe(`getPodcast`, () => {
    const mockPodcast = {
      id: 1,
      title: `test-title`,
      category: `test-category`,
    };
    it(`fail to find podcast`, async () => {
      podcastRepository.findOneBy.mockResolvedValue(undefined);
      const result = await service.getPodcast(mockPodcast.id);
      expect(result).toEqual({
        ok: false,
        error: `Podcast with id ${mockPodcast.id} not found`,
      });
    });
    it(`should find podcast`, async () => {
      podcastRepository.findOneBy.mockResolvedValue(mockPodcast);
      const result = await service.getPodcast(mockPodcast.id);
      expect(result).toEqual({
        ok: true,
        podcast: mockPodcast,
      });
    });
    it(`throw exception error`, async () => {
      podcastRepository.findOneBy.mockRejectedValue(new Error());
      const result = await service.getPodcast(mockPodcast.id);
      expect(result).toEqual({
        ok: false,
        error: `Internal server error occurred.`,
      });
    });
  });

  describe(`deletePodcast`, () => {
    const mockPodcast = {
      id: 1,
      title: `test-title`,
      category: `test-category`,
    };

    it(`fail to find podcast`, async () => {
      podcastRepository.findOneBy.mockResolvedValue(undefined);
      const result = await service.deletePodcast(mockPodcast.id);
      expect(result).toEqual({
        ok: false,
        error: `Podcast with id ${mockPodcast.id} not found`,
      });
    });
    it(`should delete the podcast`, async () => {
      podcastRepository.findOneBy.mockResolvedValue(mockPodcast);
      const result = await service.deletePodcast(mockPodcast.id);
      expect(result).toEqual({ ok: true });
    });
    it(`throw exception`, async () => {
      podcastRepository.findOneBy.mockRejectedValue(new Error());
      const result = await service.deletePodcast(mockPodcast.id);
      expect(result).toEqual({
        ok: false,
        error: `Internal server error occurred.`,
      });
    });
  });
  describe(`updatePodcast`, () => {});
});
