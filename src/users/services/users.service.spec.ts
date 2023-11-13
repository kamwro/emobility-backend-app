import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from '../../auth/services';
import { User } from '../entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository, TypeORMError } from 'typeorm';
import { createUserDTOMock } from '../../utils/mocks/dtos';
import { dataSourceMockFactory } from '../../utils/mocks/data-source-mock-factory';
import { Authentication } from '../../auth/entities';
import { NotFoundException } from '@nestjs/common/exceptions';

describe('UsersService', () => {
  let service: UsersService;
  let authService: AuthService;
  let userRepository: Repository<User>;
  const userRepositoryToken = getRepositoryToken(User);
  const authRepositoryToken = getRepositoryToken(Authentication);
  let dataSource: DataSource;
  let queryRunner: QueryRunner;

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
        AuthService,
        {
          provide: authRepositoryToken,
          useValue: {
            create: jest.fn(),
          },
        },
        DataSource,
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(userRepositoryToken);
    dataSource = module.get(DataSource);
    queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    await queryRunner.release();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Providers', () => {
    it('user repository should be defined', () => {
      expect(userRepository).toBeDefined();
    });

    it('authentication service should be defined', () => {
      expect(authService).toBeDefined();
    });

    it('data source mock should be defined', () => {
      expect(dataSource).toBeDefined();
    });

    it('query runner should be defined', () => {
      expect(queryRunner).toBeDefined();
    });
  });

  describe('Methods', () => {
    describe('create + findOne', () => {
      it('should create a new user and find it', async () => {
        const authentication = await authService.create(createUserDTOMock, queryRunner);
        service.create(createUserDTOMock, authentication, queryRunner);
        const result = service.findOne(1);
        expect(result === undefined || result === null).toEqual(false);
      });
    });

    describe('create', () => {
      it('should not create a new user with the same login, instead throw TypeORMError with the custom message', async () => {
        const authentication = await authService.create(createUserDTOMock, queryRunner);
        service.create(createUserDTOMock, authentication, queryRunner);
        try {
          service.create(createUserDTOMock, authentication, queryRunner);
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
        const authentication = await authService.create(createUserDTOMock, queryRunner);
        service.create(createUserDTOMock, authentication, queryRunner);
        service.remove(1, queryRunner);
        const result = service.findOne(1);
        expect(result).toBeInstanceOf(Promise<null>);
      });
      it('should throw a NotFoundException with a custom message when trying to delete non-existing user', () => {
        try {
          service.remove(1, queryRunner);
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e).toHaveProperty('there is no user with that id');
        }
      });
    });
  });
});
