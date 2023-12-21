import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChargingStation } from './entities/charging-station.entity';
import { InjectRepository } from '@nestjs/typeorm';

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
    return await this.#chargingStationRepository.find({ relations: ['charging_station_types'] });
  }

  async findAllBy(
    searchProperty: string,
    searchCriteria: string,
    limit: number = 20,
    sortProperty: string = 'created_at',
    sortDirection: 'ASC' | 'DESC' = 'DESC',
  ): Promise<ChargingStation[]> {
    return await this.#chargingStationRepository.find({
      take: limit,
      where: { [searchProperty]: searchCriteria },
      order: { [sortProperty]: sortDirection },
      relations: ['charging_station_types'],
    });
  }

  async sortAllBy(limit: number = 20, sortProperty: string, sortDirection: 'ASC' | 'DESC' = 'DESC'): Promise<ChargingStation[]> {
    return await this.#chargingStationRepository.find({
      take: limit,
      order: { [sortProperty]: sortDirection },
      relations: ['charging_station_types'],
    });
  }
}
