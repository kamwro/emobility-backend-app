import { IsString, IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { passwordRegex } from '../../utils/constants';

export class CreateAuthDTO {
  @IsNotEmpty({ message: 'login is required' })
  @IsEmail()
  @ApiProperty()
  readonly login: string;

  @IsNotEmpty({ message: 'password is required' })
  @IsString()
  @Length(4, 20)
  @Matches(passwordRegex, {
    message: 'password is too weak',
  })
  @ApiProperty()
  readonly password: string;
}
