import { ApiProperty } from '@nestjs/swagger';
import { AbstractDTO } from '../../utils';

export class AuthDTO extends AbstractDTO {
  @ApiProperty()
  readonly login: string;
}
