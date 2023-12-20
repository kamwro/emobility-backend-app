import { Test, TestingModule } from '@nestjs/testing';
import { ChargingStationsController } from '../charging-stations.controller';

describe('ChargingStationsController', () => {
  let controller: ChargingStationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChargingStationsController],
    }).compile();

    controller = module.get<ChargingStationsController>(ChargingStationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
