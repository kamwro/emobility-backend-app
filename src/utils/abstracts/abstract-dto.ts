import { ApiProperty } from '@nestjs/swagger';

export class AbstractDTO {
  @ApiProperty({ format: 'uuid' })
  readonly uuid: string;
}
