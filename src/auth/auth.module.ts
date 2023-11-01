import { Module } from '@nestjs/common';
import { AuthController } from './controllers';
import { AuthService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Authentication } from './entities';
import { UsersModule } from 'src/users';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Authentication])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
