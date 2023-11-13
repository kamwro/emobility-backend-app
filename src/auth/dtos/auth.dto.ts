import { ApiProperty } from '@nestjs/swagger';

export class AuthDTO {
  @ApiProperty()
  readonly login: string;
}
