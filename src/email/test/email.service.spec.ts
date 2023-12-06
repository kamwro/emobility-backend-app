import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '../../email/email.service';
import { sendEmailDTOMock } from './mocks/send-email.dto.mock';
import { ConfigService } from '@nestjs/config';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(true),
  }),
}));

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn(),
      })
      .compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should send an email', async () => {
      await service.sendEmail(sendEmailDTOMock).then((result) => {
        expect(result.message).toBe('email has been sent');
      });
    });
  });
});
