import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChargingStation } from './entities/charging-station.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BooleanProperties,
  ChargingStationProperties,
  ChargingStationsPropertiesWithRelations,
  DateProperties,
  FloatProperties,
  IntProperties,
} from './charging-station-values.enum';
import { GetStationsDto } from './dtos/get_station.dto';

@Injectable()
export class ChargingStationsService {
  readonly #chargingStationRepository: Repository<ChargingStation>;
  constructor(
    @InjectRepository(ChargingStation)
    chargingStationRepository: Repository<ChargingStation>,
  ) {
    this.#chargingStationRepository = chargingStationRepository;
  }

  async findAll(): Promise<ChargingStation[]> {
    return await this.#chargingStationRepository.find({ relations: ['type'] });
  }

  async findOneBy(searchProperty: string, searchCriteria: string): Promise<ChargingStation | null> {
    return await this.#chargingStationRepository.findOne({ where: { [searchProperty]: searchCriteria }, relations: ['charging_station_types'] });
  }

  async findAllBy(stationDto: GetStationsDto): Promise<ChargingStation[]> {
    let stations: ChargingStation[];
    let tableNameForSearch = 'charging_stations';
    let tableNameForSort = 'charging_stations';

    await this.validateProperties(stationDto);

    if (!(stationDto.searchProperty in ChargingStationProperties)) {
      tableNameForSearch = 'charging_station_types';
    }

    if (!(stationDto.sortProperty in ChargingStationProperties)) {
      tableNameForSort = 'charging_station_types';
    }

    stations = await this.#chargingStationRepository
      .createQueryBuilder(':charging_stations')
      .leftJoinAndSelect('charging_stations.type', 'charging_station_types')
      .where(`${tableNameForSearch}.${stationDto.searchProperty} = :searchCriteria`, {
        searchCriteria: stationDto.searchCriteria,
      })
      .orderBy(`${tableNameForSort}.${stationDto.sortProperty}`, `${stationDto.sortDirection}`)
      .limit(stationDto.limit)
      .getMany();
    return stations;
  }

  async validateProperties(data: GetStationsDto) {
    if (!(data.searchProperty in ChargingStationsPropertiesWithRelations) || !(data.sortProperty in ChargingStationsPropertiesWithRelations)) {
      throw new BadRequestException('invalid property');
    }

    if (data.searchProperty in IntProperties && !parseInt(data.searchCriteria)) {
      throw new BadRequestException('search criteria must be an integer');
    }

    if (data.searchProperty in FloatProperties && !parseFloat(data.searchCriteria)) {
      throw new BadRequestException('search criteria must be a number');
    }

    if (data.searchProperty in BooleanProperties && !(data.searchCriteria in ['true', 'false'])) {
      throw new BadRequestException('search criteria must either true or false');
    }

    if (data.searchProperty in DateProperties && !Date.parse(data.searchCriteria)) {
      throw new BadRequestException('search criteria must a timestamp');
    }

    if (data.searchProperty === 'current' && !(data.searchCriteria in ['DC', 'AC'])) {
      throw new BadRequestException('current must be either DC or AC');
    }

    if (!(data.sortDirection in ['ASC', 'DESC'])) {
      throw new BadRequestException('sort direction must be either ASC or DESC');
    }
  }
}
