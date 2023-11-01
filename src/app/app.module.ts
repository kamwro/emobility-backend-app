import { Module } from '@nestjs/common';
import { AppController } from './controllers';
import { AppService } from './services';
import { MeModule } from 'src/me';
import { UsersModule } from 'src/users';
import { AuthModule } from 'src/auth';
import { DbModule } from 'src/db';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    MeModule,
    AuthModule,
    UsersModule,
    DbModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NEST_API_PORT: Joi.number().default('3000'),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().default('5432'),
        POSTGRES_DBEAVER_PORT: Joi.number().default('5433'),
        POSTGRES_DB_NAME: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
