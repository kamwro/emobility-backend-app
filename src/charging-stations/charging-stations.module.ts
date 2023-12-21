import { Module } from '@nestjs/common';
import { ChargingStationsController } from './charging-stations.controller';
import { ChargingStationsService } from './charging-stations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargingStation } from './entities/charging-station.entity';
import { ChargingStationType } from './entities/station-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChargingStation, ChargingStationType])],
  controllers: [ChargingStationsController],
  providers: [ChargingStationsService],
  exports: [ChargingStationsService],
})
export class ChargingStationsModule {}
