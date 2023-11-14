import { ApiProperty } from '@nestjs/swagger';
import { AuthDTO } from '../../auth/dtos/auth.dto';

export class UserDTO {
  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly lastName: string;

  @ApiProperty()
  readonly address: string;

  @ApiProperty()
  readonly birthday: Date;

  @ApiProperty({ type: () => AuthDTO })
  readonly authentication: AuthDTO;
}
