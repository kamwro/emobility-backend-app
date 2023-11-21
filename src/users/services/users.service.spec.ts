import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { createUserDTOMock } from '../../utils/mocks/dtos/create-user.dto.mock';
import { tokenMock } from '../../utils/mocks/tokens/token.mock';
import { userRepositoryMock } from '../../utils/mocks/repositories/user.repository.mock';
import { addressRepositoryMock } from '../../utils/mocks/repositories/address.repository.mock';
import { Address } from '../entities/address.entity';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;
  const userRepositoryToken = getRepositoryToken(User);
  const addressRepositoryToken = getRepositoryToken(Address);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: userRepositoryToken,
          useValue: userRepositoryMock,
        },
        {
          provide: addressRepositoryToken,
          useValue: addressRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(userRepositoryToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('providers', () => {
    it('users repository should be defined', () => {
      expect(usersRepository).toBeDefined();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      await service.create(createUserDTOMock).then((entity) => expect(entity).toBe(User));
      expect(usersRepository.create).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('should find an existing user', async () => {
      await service.findOneById(1).then((entity) => expect(entity).toBe(User));
      expect(usersRepository.findOneBy).toHaveBeenCalled();
    });

    it('should return null when trying to find non-existing user by fake id', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(null);
      await service.findOneById(2).then((entity) => expect(entity).toBeNull());
      expect(usersRepository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('findOneByLogin', () => {
    it('should find an existing user', async () => {
      await service.findOneByLogin(createUserDTOMock.login).then((entity) => expect(entity).toBe(User));
      expect(usersRepository.findOneBy).toHaveBeenCalled();
    });

    it('should return null when trying to find non-existing user by fake login', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(null);
      await service.findOneByLogin(createUserDTOMock.login).then((entity) => expect(entity).toBeNull());
      expect(usersRepository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array with users', async () => {
      await service.findAll().then((entity) => {
        expect(entity).toStrictEqual([User]), expect(entity[0]).toBe(User);
        expect(usersRepository.find).toHaveBeenCalled();
      });
    });

    it('should return an empty array with users when there are no users', async () => {
      jest.spyOn(usersRepository, 'find').mockResolvedValueOnce([]);
      await service.findAll().then((entity) => expect(entity[0]).toBeUndefined());
      expect(usersRepository.find).toHaveBeenCalled();
    });
  });

  describe('updateRefreshToken', () => {
    it('should update a refresh token', async () => {
      await service
        .create(createUserDTOMock)
        .then(async () => await service.updateRefreshToken(1, tokenMock).then((response) => expect(response).toHaveProperty('message', 'refreshed token has been updated')));
      expect(usersRepository.findOneBy).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalled();
    });

    it('should update a refresh token when provided with null value', async () => {
      await service
        .create(createUserDTOMock)
        .then(async () => await service.updateRefreshToken(1, null).then((response) => expect(response).toHaveProperty('message', 'refreshed token has been updated')));
      expect(usersRepository.findOneBy).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalled();
    });

    it('should throw a NotFoundException when there is no user with that provided id', async () => {
      await service.updateRefreshToken(2, tokenMock).catch((e) => {
        expect(e).toBeInstanceOf(NotFoundException), expect(e.message).toBe('there is no user with that id');
      });
      expect(usersRepository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('updateVerificationKey', () => {
    it('should update refresh token', async () => {
      await service.updateVerificationKey('test', tokenMock).then((result) => expect(result).toHaveProperty('message', 'new verification key has been attached'));
      expect(usersRepository.findOneBy).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when there is no user', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(null);
      await service.updateVerificationKey('test', tokenMock).catch((e) => {
        expect(e).toBeInstanceOf(NotFoundException), expect(e.message).toBe('there is no user with that id');
      });
      expect(usersRepository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('activate', () => {
    it('should activate an user', async () => {
      let user = new User();
      user.id = 1;
      user.verificationKey = tokenMock;
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(user);
      await service.activate(1, tokenMock).then((result) => expect(result).toHaveProperty('message', 'user account activated'));
      expect(usersRepository.findOneBy).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when there is no user', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(null);
      await service.activate(1, tokenMock).catch((e) => {
        expect(e).toBeInstanceOf(NotFoundException), expect(e.message).toBe('there is no user with that id');
      });
      expect(usersRepository.findOneBy).toHaveBeenCalled();
    });

    it('should throw BadRequestsException when user is already active', async () => {
      let user = new User();
      user.isActive = true;
      user.id = 1;
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(user);
      await service.activate(1, tokenMock).catch((e) => {
        expect(e).toBeInstanceOf(BadRequestException), expect(e.message).toBe('user already active');
      });
      expect(usersRepository.findOneBy).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when keys do not match', async () => {
      let user = new User();
      user.id = 1;
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(user);
      await service.activate(1, tokenMock).catch((e) => {
        expect(e).toBeInstanceOf(UnauthorizedException), expect(e.message).toBe('verification key does not match');
      });
      expect(usersRepository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      let user = new User();
      user.id = 1;
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
      await service.remove(1).then((result) => expect(result).toHaveProperty('message', 'user deleted'));
      expect(usersRepository.findOneBy).toHaveBeenCalled();
      expect(usersRepository.delete).toHaveBeenCalled();
    });

    it('should throw a NotFoundException when trying to remove a non-existing user ', async () => {
      await service.remove(1).catch((e) => {
        expect(e).toBeInstanceOf(NotFoundException), expect(e.message).toBe('there is no user with that id');
      });
      expect(usersRepository.findOneBy).toHaveBeenCalled();
    });
  });
});
