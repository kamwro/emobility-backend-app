import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChargingStation } from './entities/charging-station.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChargingStationProperties } from './charging-station-values.enum';

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

  async findAllBy(
    searchProperty: string,
    searchCriteria: string,
    limit: number = 20,
    sortProperty: string = 'createdAt',
    sortDirection: 'DESC' | 'ASC' = 'DESC',
  ): Promise<ChargingStation[]> {
    let tableNameForSearch = 'charging_stations';
    if (!(searchProperty in ChargingStationProperties)) {
      tableNameForSearch = 'charging_station_types';
    }

    let tableNameForSort = 'charging_stations';
    if (!(sortProperty in ChargingStationProperties)) {
      tableNameForSort = 'charging_station_types';
    }

    const stations = await this.#chargingStationRepository
      .createQueryBuilder('charging_stations')
      .leftJoinAndSelect('charging_stations.type', 'charging_station_types')
      .where(`${tableNameForSearch}.${searchProperty} = '${searchCriteria}'`)
      .orderBy(`${tableNameForSort}.${sortProperty}`, `${sortDirection}`)
      .take(limit)
      .getMany();
    searchProperty;
    searchCriteria;
    limit;
    sortProperty;
    sortDirection;
    return stations;
    // return await this.#chargingStationRepository.find({
    //   take: limit,
    //   where: { [searchProperty]: searchCriteria },
    //   order: { [sortProperty]: sortDirection },
    //   relations: ['type'],
    // });
  }

  // async findAllByTypeField(
  //   searchProperty: string,
  //   searchCriteria: string,
  //   limit: number = 20,
  //   sortProperty: string = 'createdAt',
  //   sortDirection: 'DESC' | 'ASC' = 'DESC',
  // ): Promise<ChargingStation[]> {
  //   return await this.#chargingStationRepository.find({
  //     take: limit,
  //     where: {
  //       type: {
  //         [searchProperty]: searchCriteria,
  //       },
  //     },
  //     order: { [sortProperty]: sortDirection },
  //     relations: ['type'],
  //   });
  // }
}
