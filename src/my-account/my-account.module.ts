import { Module } from '@nestjs/common';
import { MyAccountController } from './controllers/my-account.controller';
import { UsersModule } from '../users/users.module';
import { RefreshTokenStrategy } from '../auth/strategies/refresh-token.strategy';
import { AccessTokenStrategy } from '../auth/strategies/access-token.strategy';

@Module({
  imports: [UsersModule],
  controllers: [MyAccountController],
  providers: [RefreshTokenStrategy, AccessTokenStrategy],
})
export class MyAccountModule {}
