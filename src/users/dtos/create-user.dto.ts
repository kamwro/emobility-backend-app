import { IsString, IsDateString, IsNotEmpty, IsEmail, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Constants } from '../../utils/constants';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'login is required' })
  @IsEmail()
  @ApiProperty()
  readonly login: string;

  @IsNotEmpty({ message: 'password is required' })
  @IsString()
  @Length(4, 20)
  @Matches(Constants.passwordRegex, {
    message: 'password is too weak',
  })
  @ApiProperty()
  readonly password: string;

  @IsNotEmpty({ message: 'first name is required' })
  @IsString()
  @ApiProperty()
  readonly firstName: string;

  @IsNotEmpty({ message: 'last name is required' })
  @IsString()
  @ApiProperty()
  readonly lastName: string;

  @IsNotEmpty({ message: 'address is required' })
  @IsString()
  @ApiProperty()
  readonly address: string;

  @IsNotEmpty({ message: 'birthday is required' })
  @IsDateString()
  @ApiProperty()
  readonly birthday: string;
}
