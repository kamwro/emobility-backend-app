import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { usersServiceMock } from '../../utils/mocks/services/users.service.mock';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService, UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(usersServiceMock)
      .compile();

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
});
