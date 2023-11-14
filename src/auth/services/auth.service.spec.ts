import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/services/users.service';
import { Authentication } from '../entities/auth.entity';
import { User } from '../../users/entities/user.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { dataSourceMockFactory } from '../../utils/mocks/factories/data-source-mock-factory';
import { createAuthDTOMock } from '../../utils/mocks/dtos/create-auth.dto.mock';
import { createUserDTOMock } from '../../utils/mocks/dtos/create-user.dto.mock';
import InternalServerErrorException from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let authRepository: Repository<Authentication>;
  const authRepositoryToken = getRepositoryToken(Authentication);
  const userRepositoryToken = getRepositoryToken(User);
  let dataSource: DataSource;
  let queryRunner: QueryRunner;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: authRepositoryToken,
          useValue: { create: jest.fn() },
        },
        UsersService,
        {
          provide: userRepositoryToken,
          useValue: {
            create: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
        DataSource,
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    authRepository = module.get<Repository<Authentication>>(authRepositoryToken);
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
    it('authentication repository should be defined', () => {
      expect(authRepository).toBeDefined();
    });

    it('users service should be defined', () => {
      expect(usersService).toBeDefined();
    });

    it('data source mock should be defined', () => {
      expect(dataSource).toBeDefined();
    });

    it('query runner should be defined', () => {
      expect(queryRunner).toBeDefined();
    });
  });

  describe('Methods', () => {
    describe('create', () => {
      it('should create a new authentication with auth creation dto', () => {
        expect(service.create(createAuthDTOMock, queryRunner)).toBeInstanceOf(Promise<Authentication>);
      });
      it('should create a new authentication with user creation dto', () => {
        expect(service.create(createUserDTOMock, queryRunner)).toBeInstanceOf(Promise<Authentication>);
      });
    });
    describe('getHash', () => {
      it('should return a hashed password', async () => {
        expect(AuthService.getHash('test')).not.toEqual('test');
      });
    });
    describe('registerUser', () => {
      it('should register an user', () => {
        service.registerUser(createUserDTOMock);
        const result = usersService.findOne(1);
        expect(result === undefined || result === null).toEqual(false);
      });
      it('should throw an InternalServerException with a custom message when trying to register taken email address', () => {
        service.registerUser(createUserDTOMock);
        try {
          service.registerUser(createUserDTOMock);
        } catch (e) {
          expect(e).toBeInstanceOf(InternalServerErrorException);
          expect(e).toHaveProperty('email already taken');
        }
      });
    });
  });
});
