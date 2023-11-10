import { Module } from '@nestjs/common';
import { MeService } from './services';
import { MeController } from './controllers';

@Module({
  controllers: [MeController],
  providers: [MeService]
})
export class MeModule { }
