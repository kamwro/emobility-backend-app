import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Controller()
@ApiTags('Home')
export class AppController {
  readonly #configService: ConfigService;
  constructor(configService: ConfigService) {
    this.#configService = configService;
  }

  @ApiExcludeEndpoint()
  @Get()
  async redirectToDocs(@Res() res: Response): Promise<void> {
    const port = this.#configService.get('NEST_API_PORT');
    const url = `http://localhost:${port}/api#/`;
    return res.redirect(HttpStatus.PERMANENT_REDIRECT, url);
  }
}
