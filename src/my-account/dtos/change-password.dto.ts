import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { passwordRegex } from '../../utils/constants/password-regex.constant';

export class ChangePasswordDTO {
  @IsNotEmpty({ message: 'password is required' })
  @IsString()
  @Length(4, 20)
  @Matches(passwordRegex, {
    message: 'password is too weak',
  })
  @ApiProperty()
  readonly newPassword: string;
}
