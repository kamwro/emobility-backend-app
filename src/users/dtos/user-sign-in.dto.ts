import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserSignInDTO {
  @IsNotEmpty({ message: 'login is required' })
  @IsEmail()
  @ApiProperty()
  readonly login: string;

  @IsNotEmpty({ message: 'password is required' })
  @IsString()
  @ApiProperty()
  readonly password: string;
}