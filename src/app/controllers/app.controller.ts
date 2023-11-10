import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from '../services';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
@ApiTags("Home")
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiExcludeEndpoint()
  @Get()
  @Redirect('http://localhost:3000/api#/')
  getHello(): string {
    return this.appService.getHello();
  }
}