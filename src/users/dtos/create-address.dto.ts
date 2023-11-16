import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDTO {
  @IsNotEmpty({ message: 'country is required' })
  @IsString()
  @ApiProperty()
  readonly country: string;

  @IsNotEmpty({ message: 'city is required' })
  @IsString()
  @ApiProperty()
  readonly city: string;

  @IsNotEmpty({ message: 'postal code / zip code is required' })
  @IsString()
  @ApiProperty()
  readonly postalCode: string;

  @IsNotEmpty({ message: 'street is required' })
  @IsString()
  @ApiProperty()
  readonly street: string;

  @IsNotEmpty({ message: 'building number is required' })
  @IsString()
  @ApiProperty()
  readonly buildingNumber: string;
}
