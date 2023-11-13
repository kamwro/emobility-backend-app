import { Module } from '@nestjs/common';
import { MyAccountService } from './services';
import { MyAccountController } from './controllers';

@Module({
  controllers: [MyAccountController],
  providers: [MyAccountService]
})
export class MyAccountModule { }
