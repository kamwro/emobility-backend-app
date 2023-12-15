import { Module } from '@nestjs/common';
import { MyAccountController } from './my-account.controller';
import { UsersModule } from '../users/users.module';
import { RefreshTokenStrategy } from '../auth/strategies/refresh-token.strategy';
import { AccessTokenStrategy } from '../auth/strategies/access-token.strategy';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [UsersModule, EmailModule],
  controllers: [MyAccountController],
  providers: [RefreshTokenStrategy, AccessTokenStrategy],
})
export class MyAccountModule {}
