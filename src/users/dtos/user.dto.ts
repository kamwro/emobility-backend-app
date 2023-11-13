import { ApiProperty } from '@nestjs/swagger';
import { AuthDTO } from '../../auth/dtos';
import { AbstractDTO } from '../../utils';

export class UserDTO extends AbstractDTO {
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
