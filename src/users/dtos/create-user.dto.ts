import { IsString, IsDateString, IsNotEmpty } from 'class-validator';
import { CreateAuthDTO } from '../../auth/dtos/create-auth.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO extends CreateAuthDTO {
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
