import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChangeAddressDTO } from './change-address.dto';

export class ChangeInfoDTO {
  @IsNotEmpty({ message: 'login is required' })
  @IsString()
  @ApiProperty()
  readonly firstName: string;

  @IsNotEmpty({ message: 'first name is required' })
  @IsString()
  @ApiProperty()
  readonly lastName: string;

  @IsNotEmpty({ message: 'address data is required' })
  @ApiProperty({ type: ChangeAddressDTO })
  readonly address: ChangeAddressDTO;
}
