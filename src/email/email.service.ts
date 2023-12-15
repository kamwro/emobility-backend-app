import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { SendEmailDTO } from './dtos/send-email.dto';
import { Message } from '../utils/types/message.type';

@Injectable()
export class EmailService {
  readonly #configService: ConfigService;
  readonly #nodeMailer: Mail;
  constructor(configService: ConfigService) {
    this.#configService = configService;
    this.#nodeMailer = createTransport({
      host: this.#configService.get('EMAIL_HOST'),
      port: this.#configService.get('EMAIL_PORT'),
      auth: {
        user: this.#configService.get('EMAIL_USER'),
        pass: this.#configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendEmail(options: SendEmailDTO): Promise<Message> {
    await this.#nodeMailer.sendMail({ from: 'Emobility Team', to: options.recipient, subject: options.subject, text: options.body });
    return { message: 'email has been sent' };
  }
}

