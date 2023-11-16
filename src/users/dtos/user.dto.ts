import { ApiProperty } from '@nestjs/swagger';
import { AddressDTO } from './address.dto';

export class UserDTO {
  @ApiProperty()
  readonly login: string;

  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly lastName: string;

  @ApiProperty()
  readonly birthday: Date;

  @ApiProperty({ type: AddressDTO })
  readonly address: AddressDTO;
}
