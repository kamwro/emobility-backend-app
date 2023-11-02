import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Controller()
@ApiTags('Home')
export class AppController {
  constructor(private readonly _configService: ConfigService) {}

  @ApiExcludeEndpoint()
  @Get()
  async redirectToDocs(@Res() res: Response): Promise<void> {
    let port = this._configService.get('NEST_API_PORT') as number;
    let url = `http://localhost:${port}/api#/` as string;
    return res.redirect(301, url);
  }
}
