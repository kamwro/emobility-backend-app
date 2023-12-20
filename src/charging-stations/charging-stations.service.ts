import { Injectable } from '@nestjs/common';

@Injectable()
export class ChargingStationsService {
  async findAll() {}

  async findOneBy(criteria: string, data: string | number) {
    criteria;
    data;
  }

  async create() {}

  async remove() {}
}
