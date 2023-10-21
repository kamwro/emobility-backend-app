import { Module } from '@nestjs/common';
import { AppController } from './controllers';
import { AppService } from './services';
import { MeModule } from 'src/me';
import { UsersModule } from 'src/users';
import { AuthModule } from 'src/auth';


@Module({
  imports: [MeModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
