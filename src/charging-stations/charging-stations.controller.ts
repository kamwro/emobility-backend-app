import { Controller, Get, Res, HttpStatus, Query } from '@nestjs/common';
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

  @ApiOperation({ summary: 'Get a charging station data' })
  @ApiTags('Charging Stations')
  @Get('')
  @ApiOkResponse({ description: 'Successfully got charging stations records' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async getStations(
    @Query()
    query: GetStationsDto,
    @Res() res: Response,
  ) {
    const stations = await this.#chargingStationsService.findAllBy({ ...query });
    if (!stations) {
      return res.status(HttpStatus.BAD_REQUEST);
    }
    return res.status(HttpStatus.OK).send(stations);
  }
}
