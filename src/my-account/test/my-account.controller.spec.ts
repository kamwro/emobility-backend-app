import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { EmailService } from '../../email/email.service';
import { usersServiceMock } from './mocks/users.service.mock';
import { AuthGuard } from '@nestjs/passport';
import { MyAccountController } from '../my-account.controller';
import { responseMock } from '../../utils/shared-mocks/response.mock';
import { createUserDTOMock } from '../../utils/shared-mocks/create-user.dto.mock';
import { changeInfoDTOMock } from '../../utils/shared-mocks/change-info.dto.mock';
import { changePasswordDTOMock } from './mocks/change-password.dto.mock';

describe('MyAccountController', () => {
  let controller: MyAccountController;
  let usersService: UsersService;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, EmailService],
      controllers: [MyAccountController],
    })
      .overrideProvider(UsersService)
      .useValue(usersServiceMock)
      .overrideProvider(EmailService)
      .useValue({
        sendEmail: jest.fn(),
      })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<MyAccountController>(MyAccountController);
    usersService = module.get<UsersService>(UsersService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('providers', () => {
    it('Users service should be defined', () => {
      expect(usersService).toBeDefined();
    });

    it('Email service should be defined', () => {
      expect(emailService).toBeDefined();
    });
  });

  describe('GET /my-account (getMyInfo)', () => {
    it('should get an info with HTTP status OK', async () => {
      await controller.getMyInfo(1, responseMock).then(() => {
        expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
      });
      expect(usersService.findOneById).toHaveBeenCalled();
    });

    it('should end with HTTP status UNAUTHORIZED when unauthorized', async () => {
      jest.spyOn(usersService, 'findOneById').mockResolvedValueOnce(null);
      await controller.getMyInfo(1, responseMock).then(() => {
        expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      });
      expect(usersService.findOneById).toHaveBeenCalled();
    });
  });

  describe('PATCH /my-account/change-info (changeMyInfo)', () => {
    it('should change info with HTTP status OK', async () => {
      await controller.changeMyInfo(changeInfoDTOMock, 1, createUserDTOMock.login, responseMock).then(() => {
        expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
      });
      expect(usersService.updateInfo).toHaveBeenCalled();
      expect(emailService.sendEmail).toHaveBeenCalled();
    });

    it('should end with HTTP status UNAUTHORIZED when unauthorized', async () => {
      jest.spyOn(usersService, 'updateInfo').mockResolvedValueOnce(null);
      await controller.changeMyInfo(changeInfoDTOMock, 1, createUserDTOMock.login, responseMock).then(() => {
        expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      });
      expect(usersService.updateInfo).toHaveBeenCalled();
    });
  });

  describe('PATCH /my-account/change-password (changeMyPassword)', () => {
    it('should change password with HTTP status OK', async () => {
      await controller.changeMyPassword(changePasswordDTOMock, 1, createUserDTOMock.login, responseMock).then(() => {
        expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
      });
      expect(usersService.updatePassword).toHaveBeenCalled();
      expect(emailService.sendEmail).toHaveBeenCalled();
    });

    it('should end with HTTP status UNAUTHORIZED when unauthorized', async () => {
      jest.spyOn(usersService, 'updatePassword').mockResolvedValueOnce(null);
      await controller.changeMyPassword(changePasswordDTOMock, 1, createUserDTOMock.login, responseMock).then(() => {
        expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      });
      expect(usersService.updatePassword).toHaveBeenCalled();
    });
  });

  describe('DELETE /my-account/delete(deleteMyAccount)', () => {
    it('should delete an account with HTTP status OK', async () => {
      await controller.deleteMyAccount(1, createUserDTOMock.login, responseMock).then(() => {
        expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
      });
      expect(usersService.remove).toHaveBeenCalled();
      expect(emailService.sendEmail).toHaveBeenCalled();
    });

    it('should end with HTTP status UNAUTHORIZED when unauthorized', async () => {
      jest.spyOn(usersService, 'remove').mockResolvedValueOnce(null);
      await controller.deleteMyAccount(1, createUserDTOMock.login, responseMock).then(() => {
        expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      });
      expect(usersService.remove).toHaveBeenCalled();
    });
  });
});
