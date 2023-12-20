import { Test, TestingModule } from '@nestjs/testing';
import { ChargingStationsService } from '../charging-stations.service';

describe('ChargingStationsService', () => {
  let service: ChargingStationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChargingStationsService],
    }).compile();

    service = module.get<ChargingStationsService>(ChargingStationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
