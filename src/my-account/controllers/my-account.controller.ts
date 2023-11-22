import { Controller, Get, Patch, Delete, Param, Res, Body } from '@nestjs/common';
import { ApiTags, ApiExcludeEndpoint, ApiOperation, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { GetCurrentUser } from '../../utils/decorators/get-current-user.decorator';
import { Response } from 'express';
import { UsersService } from '../../users/services/users.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDTO } from '../dtos/change-password.dto';
import { ChangeInfoDTO } from '../dtos/change-info.dto';

@Controller('my-account')
@ApiTags('My Account')
export class MyAccountController {
  readonly #usersService: UsersService;
  constructor(usersService: UsersService) {
    this.#usersService = usersService;
  }

  @ApiOperation({ summary: 'Get my info.' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Get('')
  @ApiOkResponse({ description: 'Successfully got an account info' })
  async getMyInfo(@GetCurrentUser('sub') userId: number, @Res() res: Response): Promise<Response> {
    const user = await this.#usersService.findOneById(userId);
    if (user) {
      return res.status(200).json({
        info: {
          login: user.login,
          'first name': user.firstName,
          'last name': user.lastName,
          birthday: user.birthday,
          address: `${user.address.street} ${user.address.buildingNumber}, ${user.address.postalCode} ${user.address.city}, ${user.address.country}`,
        },
      });
    } else {
      return res.status(404);
    }
  }

  @ApiOperation({ summary: 'Change my personal info.' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Patch('change-info')
  @ApiOkResponse({ description: 'Successfully changed some personal info' })
  async changeMyInfo(@Body() body: ChangeInfoDTO, @GetCurrentUser('sub') userId: number, @Res() res: Response): Promise<Response> {
    const message = await this.#usersService.updateInfo(userId, body);
    if (message) {
      return res.status(200).json(message);
    } else {
      return res.status(400);
    }
  }

  @ApiOperation({ summary: 'Change my password.' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Patch('change-password')
  @ApiOkResponse({ description: 'Successfully changed a password' })
  async changeMyPassword(@Body() body: ChangePasswordDTO, @GetCurrentUser('sub') userId: number, @Res() res: Response): Promise<Response> {
    const message = await this.#usersService.updatePassword(userId, body.newPassword);
    if (message) {
      return res.status(200).json(message);
    } else {
      return res.status(400);
    }
  }

  @ApiOperation({ summary: 'Delete my account.' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Delete('delete')
  @ApiOkResponse({ description: 'Successfully deleted an account' })
  async deleteMyAccount(@GetCurrentUser('sub') userId: number, @Res() res: Response): Promise<Response> {
    const message = await this.#usersService.remove(userId);
    if (message) {
      return res.status(200).json(message);
    } else {
      return res.status(400);
    }
  }

  @ApiExcludeEndpoint()
  @Get('/activate/:verificationCode')
  @ApiOkResponse({ description: 'Successfully activated an account' })
  async activateMyAccount(@Param() verificationCode: string, @Res() res: Response): Promise<Response> {
    const message = await this.#usersService.activate(verificationCode);
    if (message) {
      return res.status(200);
    } else {
      return res.status(400);
    }
  }
}
