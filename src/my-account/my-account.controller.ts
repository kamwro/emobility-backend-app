import { Controller, Get, Patch, Delete, Res, Body, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GetCurrentUser } from '../utils/decorators/get-current-user.decorator';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDTO } from './dtos/change-password.dto';
import { ChangeInfoDTO } from './dtos/change-info.dto';
import { EmailService } from '../email/email.service';

@Controller('my-account')
@ApiTags('My Account')
export class MyAccountController {
  readonly #usersService: UsersService;
  readonly #emailService: EmailService;
  constructor(usersService: UsersService, emailService: EmailService) {
    this.#usersService = usersService;
    this.#emailService = emailService;
  }

  @ApiOperation({ summary: 'Get my info.' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Get('')
  @ApiOkResponse({ description: 'Successfully got an account info' })
  @ApiUnauthorizedResponse({ description: 'Access denied' })
  async getMyInfo(@GetCurrentUser('sub') userId: number, @Res() res: Response): Promise<Response> {
    const user = await this.#usersService.findOneById(userId);
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED);
    }
    return res.status(HttpStatus.OK).send({
      info: {
        login: user.login,
        'first name': user.firstName,
        'last name': user.lastName,
        birthday: user.birthday,
        address: `${user.street} ${user.buildingNumber}, ${user.postalCode} ${user.city}, ${user.country}`,
      },
    });
  }

  @ApiOperation({ summary: 'Change my personal info.' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Patch('change-info')
  @ApiOkResponse({ description: 'Successfully changed some personal info' })
  @ApiUnauthorizedResponse({ description: 'Access denied' })
  async changeMyInfo(@Body() body: ChangeInfoDTO, @GetCurrentUser('sub') userId: number, @GetCurrentUser('login') userLogin: string, @Res() res: Response): Promise<Response> {
    const message = await this.#usersService.updateInfo(userId, body);
    if (!message) {
      return res.status(HttpStatus.UNAUTHORIZED);
    }
    this.#emailService.sendEmail({
      recipient: userLogin,
      subject: 'Change Of Your Personal Info',
      body: 'Hey, your info has been changed.',
    });
    return res.status(HttpStatus.OK).send(message);
  }

  @ApiOperation({ summary: 'Change my password.' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Patch('change-password')
  @ApiOkResponse({ description: 'Successfully changed a password' })
  @ApiUnauthorizedResponse({ description: 'Access denied' })
  async changeMyPassword(
    @Body() body: ChangePasswordDTO,
    @GetCurrentUser('sub') userId: number,
    @GetCurrentUser('login') userLogin: string,
    @Res() res: Response,
  ): Promise<Response> {
    const message = await this.#usersService.updatePassword(userId, body.oldPassword, body.newPassword);
    if (!message) {
      return res.status(HttpStatus.UNAUTHORIZED);
    }
    this.#emailService.sendEmail({
      recipient: userLogin,
      subject: 'Change Of Your Password',
      body: 'Hey, your password has been changed.',
    });
    return res.status(HttpStatus.OK).send(message);
  }

  @ApiOperation({ summary: 'Delete my account.' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Delete('delete')
  @ApiOkResponse({ description: 'Successfully deleted an account' })
  @ApiUnauthorizedResponse({ description: 'Access denied' })
  async deleteMyAccount(@GetCurrentUser('sub') userId: number, @GetCurrentUser('login') userLogin: string, @Res() res: Response): Promise<Response> {
    const message = await this.#usersService.remove(userId);
    if (!message) {
      return res.status(HttpStatus.UNAUTHORIZED);
    }
    this.#emailService.sendEmail({
      recipient: userLogin,
      subject: 'Your Account Is Deleted',
      body: 'We are sorry to hear it, but your account has been deleted.',
    });
    return res.status(HttpStatus.OK).send(message);
  }
}
