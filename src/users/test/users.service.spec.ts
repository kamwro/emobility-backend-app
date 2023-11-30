import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { createUserDTOMock } from '../../utils/mocks/dtos/create-user.dto.mock';
import { tokenMock } from '../../utils/mocks/tokens/token.mock';
import { userRepositoryMock } from '../../utils/mocks/repositories/user.repository.mock';
import { addressRepositoryMock } from '../../utils/mocks/repositories/address.repository.mock';
import { changeInfoDTOMock } from '../../utils/mocks/dtos/change-info.dto.mock';
import { Address } from '../entities/address.entity';
import { hash } from 'bcrypt';

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
      await service.create(createUserDTOMock).then((entity) => expect(entity).toBeInstanceOf(User));
      expect(usersRepository.create).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('should find an existing user', async () => {
      await service.findOneById(1).then((entity) => {
        expect(entity).toBeInstanceOf(User), expect(entity?.address).toBeInstanceOf(Address);
      });
      expect(usersRepository.findOne).toHaveBeenCalled();
    });

    it('should return null when trying to find non-existing user by fake id', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);
      await service.findOneById(2).then((entity) => expect(entity).toBeNull());
      expect(usersRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('findOneByLogin', () => {
    it('should find an existing user', async () => {
      await service.findOneByLogin(createUserDTOMock.login).then((entity) => {
        expect(entity).toBeInstanceOf(User), expect(entity?.address).toBeInstanceOf(Address);
      });
      expect(usersRepository.findOne).toHaveBeenCalled();
    });

    it('should return null when trying to find non-existing user by fake login', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);
      await service.findOneByLogin(createUserDTOMock.login).then((entity) => expect(entity).toBeNull());
      expect(usersRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array with users', async () => {
      await service.findAll().then((entity) => {
        expect(entity).toBeTruthy(), expect(entity[0]).toBeInstanceOf(User), expect(entity[0].address).toBeInstanceOf(Address);
      });
      expect(usersRepository.find).toHaveBeenCalled();
    });

    it('should return an empty array with users when there are no users', async () => {
      jest.spyOn(usersRepository, 'find').mockResolvedValueOnce([]);
      await service.findAll().then((entity) => expect(entity[0]).toBeUndefined());
      expect(usersRepository.find).toHaveBeenCalled();
    });
  });

  describe('updateRefreshToken', () => {
    it('should update a refresh token', async () => {
      await service.updateRefreshToken(1, tokenMock).then((response) => expect(response).toHaveProperty('message', 'refreshed token has been updated'));
      expect(usersRepository.findOne).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalled();
    });

    it('should update a refresh token when provided with null value', async () => {
      await service.updateRefreshToken(1, null).then((response) => expect(response).toHaveProperty('message', 'refreshed token has been updated'));
      expect(usersRepository.findOne).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalled();
    });

    it('should throw a UnauthorizedException when there is no user with that provided id', async () => {
      await service.updateRefreshToken(2, tokenMock).catch((e) => {
        expect(e).toBeInstanceOf(UnauthorizedException), expect(e.message).toBe('access denied');
      });
      expect(usersRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('updateVerificationKey', () => {
    it('should update refresh token', async () => {
      await service.updateVerificationKey('test', tokenMock).then((result) => expect(result).toHaveProperty('message', 'new verification key has been attached'));
      expect(usersRepository.findOne).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when there is no user', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);
      await service.updateVerificationKey('test', tokenMock).catch((e) => {
        expect(e).toBeInstanceOf(UnauthorizedException), expect(e.message).toBe('access denied');
      });
      expect(usersRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('activate', () => {
    it('should activate an user', async () => {
      let user = new User();
      user.verificationKey = tokenMock;
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(user);
      await service.activate(tokenMock).then((result) => expect(result).toHaveProperty('message', 'user account activated'));
      expect(usersRepository.findOneBy).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when there is no user', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(null);
      await service.activate(tokenMock).catch((e) => {
        expect(e).toBeInstanceOf(UnauthorizedException), expect(e.message).toBe('access denied');
      });
      expect(usersRepository.findOneBy).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when verification key does not match', async () => {
      let user = new User();
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(user);
      await service.activate(tokenMock).catch((e) => {
        expect(e).toBeInstanceOf(UnauthorizedException), expect(e.message).toBe('access denied');
      });
      expect(usersRepository.findOneBy).toHaveBeenCalled();
    });

    it('should throw BadRequestsException when user is already active', async () => {
      let user = new User();
      user.isActive = true;
      user.verificationKey = tokenMock;
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(user);
      await service.activate(tokenMock).catch((e) => {
        expect(e).toBeInstanceOf(BadRequestException), expect(e.message).toBe('user already active');
      });
      expect(usersRepository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      let user = new User();
      user.id = 1;
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
      await service.remove(1).then((result) => expect(result).toHaveProperty('message', 'user deleted'));
      expect(usersRepository.findOne).toHaveBeenCalled();
      expect(usersRepository.delete).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when trying to remove a non-existing user ', async () => {
      await service.remove(1).catch((e) => {
        expect(e).toBeInstanceOf(UnauthorizedException), expect(e.message).toBe('access denied');
      });
      expect(usersRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('updatePassword', () => {
    it('should update a password', async () => {
      let user = new User();
      user.password = await hash(createUserDTOMock.password, 10);
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(user);
      await service
        .updatePassword(1, createUserDTOMock.password, createUserDTOMock.password)
        .then((response) => expect(response).toHaveProperty('message', 'password has been successfully changed'));
      expect(usersRepository.findOne).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when there is no user with that provided id', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(null);
      await service.updatePassword(1, createUserDTOMock.password, createUserDTOMock.password).catch((e) => {
        expect(e).toBeInstanceOf(UnauthorizedException), expect(e.message).toBe('access denied');
      });
      expect(usersRepository.findOne).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when old password does not match', async () => {
      let user = new User();
      user.password = await hash(createUserDTOMock.password, 10);
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(user);
      await service.updatePassword(1, '123', createUserDTOMock.password).catch((e) => {
        expect(e).toBeInstanceOf(UnauthorizedException), expect(e.message).toBe('invalid password');
      });
      expect(usersRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('updateInfo', () => {
    it('should update an user info', async () => {
      await service.updateInfo(1, changeInfoDTOMock).then((response) => expect(response).toHaveProperty('message', 'user data has been successfully changed'));
      expect(usersRepository.findOne).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalled();
    });

    it('should throw a UnauthorizedException when there is no user with that provided id', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(null);
      await service.updateInfo(1, changeInfoDTOMock).catch((e) => {
        expect(e).toBeInstanceOf(UnauthorizedException), expect(e.message).toBe('access denied');
      });
      expect(usersRepository.findOne).toHaveBeenCalled();
    });
  });
});
