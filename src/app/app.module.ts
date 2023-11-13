import { Module } from '@nestjs/common';
import { AppController } from './controllers';
import { MyAccountModule } from '../my-account';
import { UsersModule } from '../users';
import { AuthModule } from '../auth';
import { DbModule } from '../db';
import { ConfigModule } from '@nestjs/config';
import { validate } from '../../env.validation';

@Module({
  imports: [
    MyAccountModule,
    AuthModule,
    UsersModule,
    DbModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
