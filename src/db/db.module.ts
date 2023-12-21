import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import { ChargingStation } from '../charging-stations/entities/charging-station.entity';
import { ChargingStationType } from '../charging-stations/entities/station-type.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_NAME'),
        entities: [User, ChargingStation, ChargingStationType],
        migrations: ['dist/src/migrations/*{.ts,.js}'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DbModule {}
