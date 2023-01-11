import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import exp from 'constants';
import { Repository } from 'typeorm';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { PodcastsService } from './podcasts.service';

type mockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
  delete: jest.fn(),
};

const TEST_POD: Podcast = {
  id: 1,
  title: `test-title1`,
  category: `test-category1`,
  rating: 0,
  episodes: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};
const TEST_POD_2: Podcast = {
  id: 2,
  title: `test-title1`,
  category: `test-category1`,
  rating: 10,
  episodes: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const TEST_EPI: Episode = {
  id: 1,
  title: 'TEST1',
  category: 'TEST1',
  createdAt: new Date(),
  updatedAt: new Date(),
  podcast: TEST_POD,
};
const TEST_EPI2: Episode = {
  id: 2,
  title: 'TEST2',
  category: 'TEST2',
  createdAt: new Date(),
  updatedAt: new Date(),
  podcast: TEST_POD,
};

const InternalServerErrorOutput = {
  ok: false,
  error: 'Internal server error occurred.',
};

describe(`PodcastsService`, () => {
  let service: PodcastsService;
  let podcastRepository: mockRepository<Podcast>;
  let episodeRepository: mockRepository<Episode>;

  // make test value
  TEST_POD.episodes.push(TEST_EPI);
  TEST_POD_2.episodes.push(TEST_EPI2);

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
      podcastRepository.find.mockResolvedValue([TEST_POD, TEST_POD_2]);
      const result = await service.getAllPodcasts();
      expect(podcastRepository.find).toHaveBeenCalled();
      expect(result).toEqual({ ok: true, podcasts: [TEST_POD, TEST_POD_2] });
    });
    it(`should fail to return podcasts array`, async () => {
      podcastRepository.find.mockRejectedValueOnce(new Error());
      const result = await service.getAllPodcasts();
      expect(podcastRepository.find).toHaveBeenCalled();
      expect(result).toMatchObject(InternalServerErrorOutput);
    });
  });
  describe(`createPodcast`, () => {
    const createPodcastArgs = {
      title: TEST_POD.title,
      category: TEST_POD.category,
    };
    it(`should create Podcast`, async () => {
      podcastRepository.create.mockReturnValue(createPodcastArgs);
      podcastRepository.save.mockResolvedValue(TEST_POD);
      const result = await service.createPodcast(createPodcastArgs);

      expect(podcastRepository.create).toHaveBeenCalled();
      expect(podcastRepository.create).toHaveBeenCalledWith(createPodcastArgs);
      expect(podcastRepository.save).toHaveBeenCalled();
      expect(podcastRepository.save).toHaveBeenCalledWith(createPodcastArgs);
      expect(result).toEqual({
        ok: true,
        id: TEST_POD.id,
      });
    });

    it(`Fail to create Podcast`, async () => {
      podcastRepository.create.mockResolvedValue(createPodcastArgs);
      podcastRepository.save.mockResolvedValue(new Error());
      const result = await service.createPodcast(createPodcastArgs);
      expect(result).toMatchObject(InternalServerErrorOutput);
    });
  });

  describe(`getPodcast`, () => {
    it(`fail to find podcast`, async () => {
      podcastRepository.findOneBy.mockResolvedValue(null);
      const result = await service.getPodcast(TEST_POD.id);

      expect(podcastRepository.findOneBy).toHaveBeenCalled();
      expect(podcastRepository.findOneBy).toHaveBeenCalledWith({
        id: TEST_POD.id,
      });
      expect(result).toEqual({
        ok: false,
        error: `Podcast with id ${TEST_POD.id} not found`,
      });
    });
    it(`should find podcast`, async () => {
      podcastRepository.findOneBy.mockResolvedValue(TEST_POD);
      const result = await service.getPodcast(TEST_POD.id);
      expect(result).toEqual({
        ok: true,
        podcast: TEST_POD,
      });
    });
    it(`throw exception error`, async () => {
      podcastRepository.findOneBy.mockRejectedValue(new Error());
      const result = await service.getPodcast(TEST_POD.id);
      expect(result).toMatchObject(InternalServerErrorOutput);
    });
  });

  describe(`deletePodcast`, () => {
    it(`fail delete podcast because of getPodcast`, async () => {
      jest.spyOn(service, `getPodcast`).mockImplementationOnce(async (id) => ({
        ok: false,
        error: `Podcast with id ${id} not found`,
      }));
      const result = await service.deletePodcast(TEST_POD.id);
      expect(service.getPodcast).toHaveBeenCalled();
      expect(service.getPodcast).toHaveBeenCalledWith(TEST_POD.id);
      expect(result).toEqual({
        ok: false,
        error: `Podcast with id ${TEST_POD.id} not found`,
      });
    });
    it(`should delete the podcast`, async () => {
      jest.spyOn(service, `getPodcast`).mockImplementation(async (id) => {
        return { ok: true, podcast: TEST_POD };
      });
      const result = await service.deletePodcast(TEST_POD.id);
      expect(result).toEqual({ ok: true });
    });
    it(`fail to delete podcast`, async () => {
      jest.spyOn(service, `getPodcast`).mockImplementation(async (id) => {
        return { ok: true, podcast: TEST_POD };
      });
      podcastRepository.delete.mockRejectedValue(new Error());
      const result = await service.deletePodcast(TEST_POD.id);
      expect(result).toMatchObject(InternalServerErrorOutput);
    });
  });
  describe(`updatePodcast`, () => {
    it(`should update podcast`, async () => {
      jest.spyOn(service, `getPodcast`).mockImplementation(async (id) => {
        return { ok: true, podcast: TEST_POD };
      });
      const payload = { rating: 2 };
      const result = await service.updatePodcast({
        id: TEST_POD.id,
        payload,
      });
      const updatedArgs = { ...TEST_POD, ...payload };

      expect(service.getPodcast).toHaveBeenCalled();
      expect(service.getPodcast).toHaveBeenCalledWith(TEST_POD.id);

      expect(podcastRepository.save).toHaveBeenCalled();
      expect(podcastRepository.save).toHaveBeenCalledWith(updatedArgs);

      expect(result).toMatchObject({ ok: true });
    });

    it(`should fail because of save error`, async () => {
      jest.spyOn(service, `getPodcast`).mockImplementation(async (id) => {
        return { ok: true, podcast: TEST_POD };
      });
      const payload = { rating: 2 };
      podcastRepository.save.mockRejectedValue(new Error());
      const result = await service.updatePodcast({
        id: TEST_POD.id,
        payload,
      });
      const updatedArgs = { ...TEST_POD, ...payload };

      expect(service.getPodcast).toHaveBeenCalled();
      expect(service.getPodcast).toHaveBeenCalledWith(TEST_POD.id);

      expect(podcastRepository.save).toHaveBeenCalled();
      expect(podcastRepository.save).toHaveBeenCalledWith(updatedArgs);

      expect(result).toMatchObject({ ok: false });
    });

    it(`should fail becaue of payload error`, async () => {
      jest.spyOn(service, 'getPodcast').mockImplementationOnce(async (id) => ({
        ok: true,
        podcast: TEST_POD,
      }));
      const payload = { rating: 300 };
      const result = await service.updatePodcast({
        id: TEST_POD.id,
        payload,
      });

      expect(service.getPodcast).toHaveBeenCalled();
      expect(service.getPodcast).toHaveBeenCalledWith(TEST_POD.id);
      expect(podcastRepository.save).toHaveBeenCalled();

      expect(result).toMatchObject({
        ok: false,
        error: 'Rating must be between 1 and 5.',
      });
    });

    it(`should fail becaue of getPodcast error`, async () => {
      jest.spyOn(service, `getPodcast`).mockImplementation(async (id) => {
        return { ok: false, error: `Podcast with id ${TEST_POD.id} not found` };
      });
      const payload = { rating: 2 };
      const result = await service.updatePodcast({
        id: TEST_POD.id,
        payload,
      });

      expect(service.getPodcast).toHaveBeenCalled();
      expect(service.getPodcast).toHaveBeenCalledWith(TEST_POD.id);
      expect(podcastRepository.save).toHaveBeenCalled();

      expect(result).toEqual({
        ok: false,
        error: `Podcast with id ${TEST_POD.id} not found`,
      });
    });
  });
});
