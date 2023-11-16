import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createUserDTOMock } from '../../utils/mocks/dtos/create-user.dto.mock';
import InternalServerErrorException from '@nestjs/common';
import { Address } from '../../users/entities/address.entity';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;
  const userRepositoryToken = getRepositoryToken(User);
  const addressRepositoryToken = getRepositoryToken(Address);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        UsersService,
        {
          provide: userRepositoryToken,
          useValue: {
            create: jest.fn(),
            findOneBy: jest.fn(),
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

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Providers', () => {
    it('users service should be defined', () => {
      expect(usersService).toBeDefined();
    });
    it('jwt service should be defined', () => {
      expect(jwtService).toBeDefined();
    });
  });

  describe('Methods', () => {
    describe('getHash', () => {
      it('should return a hashed password', async () => {
        expect(AuthService.getHash('test')).not.toEqual('test');
      });
    });
    describe('registerUser', () => {
      it('should register an user', () => {
        service.registerUser(createUserDTOMock);
        const result = usersService.findOneById(1);
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
