import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { usersServiceMock } from '../../utils/mocks/services/users.service.mock';
import { jwtServiceMock } from '../../utils/mocks/services/jwt.service.mock';
import { emailServiceMock } from '../../utils/mocks/services/email.service.mock';
import { createUserDTOMock } from '../../utils/mocks/dtos/create-user.dto.mock';
import { userSignInDTOMock } from '../../utils/mocks/dtos/user-sign-in.dto.mock';
import { User } from '../../users/user.entity';
import { tokenMock } from '../../utils/mocks/tokens/token.mock';
import { hash } from 'bcrypt';
import { EmailService } from '../../email/email.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService, ConfigService, UsersService, EmailService],
    })
      .overrideProvider(UsersService)
      .useValue(usersServiceMock)
      .overrideProvider(EmailService)
      .useValue(emailServiceMock)
      .overrideProvider(JwtService)
      .useValue(jwtServiceMock)
      .overrideProvider(ConfigService)
      .useValue({ get: jest.fn() })
      .compile();

    service = module.get<AuthService>(AuthService);
    emailService = module.get<EmailService>(EmailService);
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

    it('email service should be defined', () => {
      expect(emailService).toBeDefined();
    });
  });

  describe('registerUser', () => {
    it('should register an user', async () => {
      await service.registerUser(createUserDTOMock).then((result) => {
        expect(result.info).toBeTruthy();
        expect(result.message).toBe('activation link has been sent');
      });
      expect(usersService.create).toHaveBeenCalled();
      expect(usersService.updateVerificationKey).toHaveBeenCalled();
      expect(emailService.sendEmail).toHaveBeenCalled();
      expect(jwtService.signAsync).toHaveBeenCalled();
    });

    it('should throw an BadRequestException when trying to add user with email already registered', async () => {
      jest.spyOn(usersService, 'create').mockImplementationOnce(() => {
        throw new Error();
      });
      await service.registerUser(createUserDTOMock).catch((e) => {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('email already taken');
      });
      expect(usersService.create).toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    it('should sign in an active user', async () => {
      let user = new User();
      user.login = userSignInDTOMock.login;
      user.isActive = true;
      const plainPassword = userSignInDTOMock.password;
      user.password = await hash(plainPassword, 10);
      jest.spyOn(usersService, 'findOneByLogin').mockResolvedValueOnce(user);
      await service.signIn(userSignInDTOMock).then((entity) => {
        expect(entity).toHaveProperty('accessToken');
        expect(entity.refreshToken).toBe(tokenMock);
      });
      expect(usersService.findOneByLogin).toHaveBeenCalled();
      expect(jwtService.signAsync).toHaveBeenCalled();
      expect(usersService.updateRefreshToken).toHaveBeenCalled();
    });

    it('should throw an UnauthorizedException when cannot find the user with provided login', async () => {
      jest.spyOn(usersService, 'findOneByLogin').mockResolvedValueOnce(null);
      await service.signIn(userSignInDTOMock).catch((e) => {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.message).toBe('access denied');
      });
      expect(usersService.findOneByLogin).toHaveBeenCalled();
    });

    it('should throw an UnauthorizedException when user is not active', async () => {
      await service.signIn(userSignInDTOMock).catch((e) => {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.message).toBe('access denied');
      });
      expect(usersService.findOneByLogin).toHaveBeenCalled();
    });

    it('should throw an BadRequestException when user is already signed in', async () => {
      let user = new User();
      user.hashedRefreshToken = tokenMock;
      user.isActive = true;
      jest.spyOn(usersService, 'findOneByLogin').mockResolvedValueOnce(user);
      await service.signIn(userSignInDTOMock).catch((e) => {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('user already signed in');
      });
      expect(usersService.findOneByLogin).toHaveBeenCalled();
    });

    it('should throw an UnauthorizedException when password is not valid', async () => {
      let user = new User();
      user.password = '123';
      user.isActive = true;
      jest.spyOn(usersService, 'findOneByLogin').mockResolvedValueOnce(user);
      await service.signIn(userSignInDTOMock).catch((e) => {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.message).toBe('access denied');
      });
      expect(usersService.findOneByLogin).toHaveBeenCalled();
    });
  });

  describe('signOut', () => {
    it('should sign out an user', async () => {
      let user = new User();
      user.hashedRefreshToken = tokenMock;
      jest.spyOn(usersService, 'findOneById').mockResolvedValueOnce(user);
      await service.signOut(1).then((result) => expect(result.message).toBe('signed out'));
      expect(usersService.findOneById).toHaveBeenCalled();
      expect(usersService.updateRefreshToken).toHaveBeenCalled();
    });

    it('should throw an NotFoundException when user is not signed in', async () => {
      let user = new User();
      jest.spyOn(usersService, 'findOneById').mockResolvedValueOnce(user);
      await service.signOut(1).catch((e) => {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('user is not logged in');
      });
      expect(usersService.findOneById).toHaveBeenCalled();
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens', async () => {
      let user = new User();
      user.isActive = true;
      user.hashedRefreshToken = await hash(tokenMock, 10);
      jest.spyOn(usersService, 'findOneById').mockResolvedValueOnce(user);
      await service.refreshTokens(1, tokenMock).then((entity) => {
        expect(entity).toHaveProperty('accessToken');
        expect(entity.refreshToken).toBe(tokenMock);
      });
      expect(usersService.findOneById).toHaveBeenCalled();
      expect(jwtService.signAsync).toHaveBeenCalled();
      expect(usersService.updateRefreshToken).toHaveBeenCalled();
    });

    it('should throw an UnauthorizedException when user is not found', async () => {
      jest.spyOn(usersService, 'findOneById').mockResolvedValueOnce(null);
      await service.refreshTokens(1, tokenMock).catch((e) => {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.message).toBe('access denied');
      });
      expect(usersService.findOneById).toHaveBeenCalled();
    });

    it('should throw an UnauthorizedException when user is not active', async () => {
      await service.refreshTokens(1, tokenMock).catch((e) => {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.message).toBe('access denied');
      });
      expect(usersService.findOneById).toHaveBeenCalled();
    });

    it('should throw an UnauthorizedException when there is no refresh token active', async () => {
      let user = new User();
      user.isActive = true;
      jest.spyOn(usersService, 'findOneById').mockResolvedValueOnce(user);
      await service.refreshTokens(1, tokenMock).catch((e) => {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.message).toBe('access denied');
      });
      expect(usersService.findOneById).toHaveBeenCalled();
    });

    it('should throw an UnauthorizedException when provided token does not match with the real one', async () => {
      let user = new User();
      user.isActive = true;
      user.hashedRefreshToken = tokenMock;
      jest.spyOn(usersService, 'findOneById').mockResolvedValueOnce(user);
      await service.refreshTokens(1, 'fakeToken').catch((e) => {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.message).toBe('access denied');
      });
      expect(usersService.findOneById).toHaveBeenCalled();
    });
  });

  describe('getTokens', () => {
    it('should generate an access token and an refresh token', async () => {
      await service.getTokens({ sub: 1, login: createUserDTOMock.login }).then((entity) => {
        expect(entity).toHaveProperty('accessToken');
        expect(entity).toHaveProperty('refreshToken');
      });
      expect(jwtService.signAsync).toHaveBeenCalled();
    });
  });

  describe('getVerificationToken', () => {
    it('should generate a verification key', async () => {
      await service.getVerificationToken(createUserDTOMock.login).then((result) => {
        expect(result).toBeTruthy();
      });
      expect(jwtService.signAsync).toHaveBeenCalled();
    });
  });

  describe('sendConfirmationLink', () => {
    it('should send a confirmation link', async () => {
      await service.sendConfirmationLink(createUserDTOMock.login).then((result) => {
        expect(result.message).toBe('confirmation link has been send');
      });
      expect(jwtService.signAsync).toHaveBeenCalled();
      expect(usersService.updateVerificationKey).toHaveBeenCalled();
      expect(emailService.sendEmail).toHaveBeenCalled();
    });
  });

  describe('activateUser', () => {
    it('should activate an user', async () => {
      await service.activateUser(tokenMock).then((result) => {
        expect(result.message).toBe('user account activated');
      });
      expect(jwtService.verifyAsync).toHaveBeenCalled();
      expect(usersService.activate).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when verification code is no longer active or valid', async () => {
      jest.spyOn(jwtService, 'verifyAsync').mockImplementationOnce(() => {
        throw new Error();
      });
      await service.activateUser(tokenMock).catch((e) => {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.message).toBe('access denied');
      });
      expect(jwtService.verifyAsync).toHaveBeenCalled();
    });
  });
});
