import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { MyAccountModule } from '../my-account/my-account.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { DbModule } from '../db/db.module';
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
