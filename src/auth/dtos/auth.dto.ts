import { ApiProperty } from '@nestjs/swagger';
import { AbstractDTO } from 'src/utils';

export class AuthDTO extends AbstractDTO {
  @ApiProperty()
  readonly login: string;
}
