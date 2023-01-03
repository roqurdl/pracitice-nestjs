import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

const mockServices = {
  findOneBy: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneByOrFail: jest.fn(),
};
const mockJwtService = {
  sign: jest.fn(() => `return-test-token`),
  verifyToken: jest.fn(),
};

type mockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe(`UserService`, () => {
  let service: UserService;
  let jwtService: JwtService;
  let userRepository: mockRepository<User>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockServices,
        },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it(`should be defined`, () => {
    expect(service).toBeDefined();
  });

  describe(`createUser`, () => {
    const createUserArgs = {
      email: 'test-email',
      password: 'test-password',
      role: 0,
    };
    it(`should already exists email`, async () => {
      userRepository.findOneBy.mockResolvedValue({ email: `test@exists.com` });
      const result = await service.createUser(createUserArgs);
      expect(result).toEqual({
        ok: false,
        error: `The Email is already exist.`,
      });
    });
    it(`should create user`, async () => {
      userRepository.findOneBy.mockResolvedValue(undefined);

      userRepository.create.mockReturnValue(createUserArgs);
      userRepository.save.mockResolvedValue(createUserArgs);

      const result = await service.createUser(createUserArgs);

      expect(userRepository.create).toHaveBeenCalled();
      expect(userRepository.create).toHaveBeenCalledWith(createUserArgs);

      expect(userRepository.save).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalledWith(createUserArgs);

      expect(result).toEqual({ ok: true });
    });

    it(`should fail on exception`, async () => {
      userRepository.findOneBy.mockRejectedValue(new Error());
      const result = await service.createUser(createUserArgs);
      expect(result).toEqual({
        ok: false,
        error: `Should not create User Account.`,
      });
    });
  });
  describe(`login`, () => {
    const loginUserArgs = {
      email: `test@pleae.work`,
      password: `test-password`,
    };
    it(`should fail to find user`, async () => {
      userRepository.findOneBy.mockResolvedValue(undefined);
      const result = await service.login(loginUserArgs);

      expect(userRepository.findOneBy).toHaveBeenCalled();
      expect(userRepository.findOneBy).toHaveBeenCalledWith(expect.any(Object));

      expect(result).toEqual({ ok: false, error: `User is not found.` });
    });

    it(`should fail if the password is wrong`, async () => {
      const mockedUser = {
        hashCheck: jest.fn(() => Promise.resolve(false)),
      };
      userRepository.findOneBy.mockResolvedValue(mockedUser);
      const result = await service.login(loginUserArgs);
      expect(result).toEqual({
        ok: false,
        error: `You enter the Wrong Password`,
      });
    });
    it(`should return token if the password is right`, async () => {
      const mockedUser = {
        id: 1,
        hashCheck: jest.fn(() => Promise.resolve(true)),
      };
      userRepository.findOneBy.mockResolvedValue(mockedUser);

      const result = await service.login(loginUserArgs);

      expect(jwtService.sign).toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalledWith({ id: mockedUser.id });

      expect(result).toEqual({
        ok: true,
        token: `return-test-token`,
      });
    });
    it(`should fail on exception`, async () => {
      userRepository.findOneBy.mockRejectedValue(new Error());
      const result = await service.login(loginUserArgs);
      expect(result).toEqual({ ok: false, error: `Could not login` });
    });
  });

  describe(`findById`, () => {
    const TEST_USER = {
      id: 1,
    };
    it(`should not find user by wrong Id`, async () => {
      userRepository.findOneByOrFail.mockResolvedValue(null);
      const result = await service.findById(TEST_USER.id);
      expect(result).toEqual({ ok: true, user: null });
    });
    it(`should find user by Id`, async () => {
      userRepository.findOneByOrFail.mockResolvedValue(TEST_USER);
      const result = await service.findById(TEST_USER.id);
      expect(result).toEqual({ ok: true, user: TEST_USER });
    });
    it(`shoul fail find user because of findOneByOrFail`, async () => {
      userRepository.findOneByOrFail.mockRejectedValue(new Error());
      const result = await service.findById(TEST_USER.id);
      expect(result).toEqual({
        ok: false,
        error: `There is no User Id: ${TEST_USER.id}`,
      });
    });
  });

  describe(`editProfile`, () => {
    it(`should change email`, async () => {
      const editEmailArgs = {
        userId: 1,
        Input: { email: `test@after.com` },
      };
      const beforeUser = {
        email: `test@before.com`,
      };
      const afterUser = {
        email: `test@after.com`,
      };
      userRepository.findOneBy.mockResolvedValue(beforeUser);

      const result = await service.editProfile(
        editEmailArgs.userId,
        editEmailArgs.Input,
      );

      expect(userRepository.findOneBy).toHaveBeenCalled();
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        id: editEmailArgs.userId,
      });

      expect(userRepository.save).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalledWith(afterUser);

      expect(result).toEqual({
        ok: true,
      });
    });
    it(`should change password`, async () => {
      const editEmailArgs = {
        userId: 1,
        Input: { password: `New Password` },
      };
      userRepository.findOneBy.mockResolvedValue({ password: `old` });
      const result = await service.editProfile(
        editEmailArgs.userId,
        editEmailArgs.Input,
      );
      expect(userRepository.save).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalledWith(editEmailArgs.Input);

      expect(result).toEqual({
        ok: true,
      });
    });

    it(`should fail on exception`, async () => {
      userRepository.findOneBy.mockResolvedValue(undefined);
      const result = await service.editProfile(1, { email: `test` });
      expect(result).toEqual({
        ok: false,
        error: 'Could not update profile',
      });
    });
  });
});
