import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MyAccountModule } from '../my-account/my-account.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { DbModule } from '../db/db.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from '../env.validation';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { EmailModule } from '../email/email.module';
import { ChargingStationsModule } from '../charging-stations/charging-stations.module';

@Module({
  imports: [
    MyAccountModule,
    AuthModule,
    UsersModule,
    DbModule,
    EmailModule,
    ChargingStationsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => [
        {
          name: 'short',
          ttl: configService.get('THROTTLE_TTL_SHORT') as number,
          limit: configService.get('THROTTLE_LIMIT_SHORT') as number,
        },
        {
          name: 'medium',
          ttl: configService.get('THROTTLE_TTL_MEDIUM') as number,
          limit: configService.get('THROTTLE_LIMIT_MEDIUM') as number,
        },
        {
          name: 'long',
          ttl: configService.get('THROTTLE_TTL_LONG') as number,
          limit: configService.get('THROTTLE_LIMIT_LONG') as number,
        },
      ],
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
