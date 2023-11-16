import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeORMError } from 'typeorm';
import { createUserDTOMock } from '../../utils/mocks/dtos/create-user.dto.mock';
import { Address } from '../entities/address.entity';

describe('UsersService', () => {
  let service: UsersService;
  const userRepositoryToken = getRepositoryToken(User);
  const addressRepositoryToken = getRepositoryToken(Address);

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
            save: jest.fn(),
          },
        },
        {
          provide: addressRepositoryToken,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Methods', () => {
    describe('create + findOneById + findOneByLogin', () => {
      it('should create a new user and find it', async () => {
        service.create(createUserDTOMock);
        const resultById = service.findOneById(1);
        expect(resultById).not.toBeFalsy();
        const resultByLogin = service.findOneByLogin('test');
        expect(resultByLogin).not.toBeFalsy();
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

    describe('findOneById', () => {
      it('should return null when trying to find non-existing user', () => {
        const result = service.findOneById(2);
        expect(result).toBeInstanceOf(Promise<null>);
      });
    });

    describe('findOneByLogin', () => {
      it('should return null when trying to find non-existing user', () => {
        const result = service.findOneByLogin('random');
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
        const result = service.findOneById(1);
        expect(result).toBeInstanceOf(Promise<null>);
      });
    });
  });
});
