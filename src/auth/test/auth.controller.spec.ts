import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { AuthGuard } from '@nestjs/passport';
import { authServiceMock } from './mocks/auth.service.mock';

describe('MyAccountController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
      controllers: [AuthController],
    })
      .overrideProvider(AuthService)
      .useValue(authServiceMock)
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .overrideGuard(AuthGuard('jwt-refresh'))
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('providers', () => {
    it('Auth service should be defined', () => {
      expect(authService).toBeDefined();
    });
  });

  describe('POST /auth/register (register)', () => {
    it('should register an user with HTTP status OK', async () => {});
    it('should end with HTTP status BAD_REQUEST when bad dto', async () => {});
  });

  describe('POST /auth/login (signIn)', () => {
    it('should sign in an user with HTTP status OK', async () => {});
    it('should end with HTTP status UNAUTHORIZED when unauthorized', async () => {});
  });

  describe('GET /auth/logout (signOut)', () => {
    it('should sign out an user with HTTP status OK', async () => {});
    it('should end with HTTP status NOT_FOUND when no user is signed in', async () => {});
  });

  describe('GET /auth/refresh (refresh)', () => {
    it('should refresh session with HTTP status OK', async () => {});
    it('should end with HTTP status UNAUTHORIZED when unauthorized', async () => {});
  });

  describe('PATCH /auth/resend-confirmation-link (resendActivationLink)', () => {
    it('should send link HTTP status OK', async () => {
      //
      expect(authService.sendConfirmationLink).toHaveBeenCalled();
    });
  });

  describe('GET /auth/activate/:verificationCode (activateMyAccount)', () => {
    it('should activate an account with HTTP status OK', async () => {
      //
      expect(authService.activateUser).toHaveBeenCalled();
    });
    it('should end with HTTP status UNAUTHORIZED when unauthorized', async () => {
      jest.spyOn(authService, 'activateUser').mockResolvedValueOnce(null);
      //
      expect(authService.activateUser).toHaveBeenCalled();
    });
  });
});
