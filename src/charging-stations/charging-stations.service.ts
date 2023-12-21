import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChargingStation } from './entities/charging-station.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChargingStationProperties } from './charging-station-values.enum';
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
    let tableNameForSearch = 'charging_stations';
    if (!(stationDto.searchProperty in ChargingStationProperties)) {
      tableNameForSearch = 'charging_station_types';
    }

    let tableNameForSort = 'charging_stations';
    if (!(stationDto.sortProperty in ChargingStationProperties)) {
      tableNameForSort = 'charging_station_types';
    }

    const stations = await this.#chargingStationRepository
      .createQueryBuilder('charging_stations')
      .leftJoinAndSelect('charging_stations.type', 'charging_station_types')
      .where(`${tableNameForSearch}.${stationDto.searchProperty} = '${stationDto.searchCriteria}'`)
      .orderBy(`${tableNameForSort}.${stationDto.sortProperty}`, `${stationDto.sortDirection}`)
      .take(stationDto.limit)
      .getMany();
    return stations;
  }
}
