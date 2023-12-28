import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetStationsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'for example: id, producer, hasWirelessCharging (ambiguous fields will be interpreted as charging_stations fields)' })
  readonly searchProperty: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'value of the searchProperty' })
  readonly searchCriteria: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ description: 'how many records to show', default: 20 })
  readonly limit: number = 20;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'property by which a sort will be performed', default: 'createdAt' })
  readonly sortProperty: string = 'createdAt';

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'ASC or DESC', default: 'DESC' })
  readonly sortDirection: 'ASC' | 'DESC' = 'DESC';
}
