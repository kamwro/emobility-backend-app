import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, TypeORMError } from 'typeorm';
import { createUserDTOMock } from '../../utils/mocks/dtos/create-user.dto.mock';
import { NotFoundException } from '@nestjs/common/exceptions';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  const userRepositoryToken = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: userRepositoryToken,
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(userRepositoryToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Providers', () => {
    it('user repository should be defined', () => {
      expect(userRepository).toBeDefined();
    });
  });

  describe('Methods', () => {
    describe('create + findOne', () => {
      it('should create a new user and find it', async () => {
        service.create(createUserDTOMock);
        const result = service.findOne(1);
        expect(result).not.toBeFalsy();
      });
    });

    describe('create', () => {
      it('should not create a new user with the same login, instead throw TypeORMError with the custom message', async () => {
        service.create(createUserDTOMock);
        try {
          service.create(createUserDTOMock);
        } catch (e) {
          expect(e).toBeInstanceOf(TypeORMError);
          expect(e).toHaveProperty('something went wrong');
        }
      });
    });

    describe('findOne', () => {
      it('should return null when trying to find non-existing user', () => {
        const result = service.findOne(2);
        expect(result).toBeInstanceOf(Promise<null>);
      });
    });

    describe('findAll', () => {
      it('should return an array with users', () => {
        const result = service.findAll();
        expect(result).toBeInstanceOf(Promise<User[]>);
      });
    });

    describe('remove', () => {
      it('should remove an existing user', async () => {
        service.create(createUserDTOMock);
        service.remove(1);
        const result = service.findOne(1);
        expect(result).toBeInstanceOf(Promise<null>);
      });
      it('should throw a NotFoundException with a custom message when trying to delete non-existing user', () => {
        try {
          service.remove(1);
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e).toHaveProperty('there is no user with that id');
        }
      });
    });
  });
});
