import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../../users/services/users.service';
import { authServiceMock } from '../../utils/mocks/services/auth.service.mock';

describe('AppController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, AuthService],
      controllers: [AuthController],
    })
      .overrideProvider(AuthService)
      .useValue(authServiceMock)
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('AuthController', () => {
    it('should be defined', () => {
      expect(authController).toBeDefined();
    });
  });

  describe('Register', () => {
    it('should register an user with a valid data', () => {
        
    });
  });

});
