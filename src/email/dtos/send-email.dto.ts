import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class SendEmailDTO {
  @IsNotEmpty({ message: 'email recipient is required' })
  @IsEmail()
  recipient: string;

  @IsNotEmpty({ message: 'email subject is required' })
  @IsString()
  subject: string;

  @IsNotEmpty({ message: 'email body is required' })
  @IsString()
  body: string;
}
