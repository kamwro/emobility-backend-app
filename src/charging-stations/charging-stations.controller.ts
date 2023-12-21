import { Controller, Get, ValidationPipe, Res, HttpStatus, Query } from '@nestjs/common';
import { ChargingStationsService } from './charging-stations.service';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetStationsDto } from './dtos/get_station.dto';
import { Response } from 'express';

@Controller('charging-stations')
export class ChargingStationsController {
  readonly #chargingStationsService: ChargingStationsService;
  constructor(chargingStationsService: ChargingStationsService) {
    this.#chargingStationsService = chargingStationsService;
  }

  @ApiOperation({ summary: 'Register an account.' })
  @ApiTags('Charging Stations')
  @Get('')
  @ApiOkResponse({ description: 'Successfully got charging stations records' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async getStations(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    { searchProperty, searchCriteria, limit, sortProperty, sortDirection }: GetStationsDto,
    @Res() res: Response,
  ) {
    const stations = await this.#chargingStationsService.findAllBy(searchProperty, searchCriteria, limit, sortProperty, sortDirection);
    return res.status(HttpStatus.OK).send(stations);
  }
}
