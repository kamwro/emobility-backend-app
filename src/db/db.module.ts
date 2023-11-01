import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities';
import { Authentication } from 'src/auth/entities';
import { AuthSubscriber } from 'src/auth/subscribers';

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
        database: configService.get('POSTGRES_DB_NAME'),
        entities: [User, Authentication],
        subscribers: [AuthSubscriber],
        synchronize: true,
        // TODO: introduce migrations for production
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DbModule {}