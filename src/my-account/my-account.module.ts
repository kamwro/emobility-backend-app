import { Module } from '@nestjs/common';
import { MyAccountService } from './services/my-account.service';
import { MyAccountController } from './controllers/my-account.controller';

@Module({
  controllers: [MyAccountController],
  providers: [MyAccountService],
})
export class MyAccountModule {}
