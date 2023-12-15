import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { passwordRegex } from '../../utils/constants/password-regex.constant';

export class ChangePasswordDTO {
  @IsNotEmpty({ message: 'old password is required' })
  @IsString()
  readonly oldPassword: string;

  @IsNotEmpty({ message: 'new password is required' })
  @IsString()
  @Length(4, 20)
  @Matches(passwordRegex, {
    message: 'password is too weak',
  })
  @ApiProperty()
  readonly newPassword: string;
}
