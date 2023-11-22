import { Controller, Get, Post, Patch, Body, UseGuards, Res } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiCreatedResponse, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { CreateUserDTO } from '../../users/dtos/create-user.dto';
import { UserSignInDTO } from '../../users/dtos/user-sign-in.dto';
import { Message } from '../../utils/types/message.type';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUser } from '../../utils/decorators/get-current-user.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  readonly #authService: AuthService;
  constructor(authService: AuthService) {
    this.#authService = authService;
  }

  @ApiOperation({ summary: 'Register an account.' })
  @ApiTags('Account Creation')
  @Post('register')
  @ApiCreatedResponse({ description: 'Successfully created an account - activation code has been sent' })
  async register(@Body() body: CreateUserDTO, @Res() res: Response): Promise<Response> {
    const message = await this.#authService.registerUser(body);
    if (message) {
      return res.status(201).send(message);
    } else return res.status(400);
  }

  @ApiOperation({ summary: 'Login to receive an access token.' })
  @ApiTags('Authentication')
  @Post('login')
  @ApiOkResponse({ description: 'Successfully signed in' })
  async signIn(@Body() body: UserSignInDTO, @Res() res: Response): Promise<Response> {
    const tokens = await this.#authService.signIn(body);
    if (tokens) {
      return res.status(200).send(tokens);
    } else return res.status(400);
  }

  @ApiOperation({ summary: 'Logout from the current session.' })
  @ApiTags('Authentication')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  @ApiOkResponse({ description: 'Successfully signed out' })
  async signOut(@GetCurrentUser('sub') userId: number, @Res() res: Response): Promise<Response> {
    const message = await this.#authService.signOut(userId);
    if (message) {
      return res.status(200).json(message);
    } else return res.status(400);
  }

  @ApiOperation({ summary: 'Refresh the session.' })
  @ApiTags('Authentication')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh')
  @ApiOkResponse({ description: 'Successfully refreshed the session' })
  async refresh(@GetCurrentUser('sub') userId: number, @GetCurrentUser('refreshToken') refreshToken: string, @Res() res: Response): Promise<Response> {
    const tokens = await this.#authService.refreshTokens(userId, refreshToken);
    if (tokens) {
      return res.status(200).json(tokens);
    } else return res.status(400);
  }

  @Patch('resend-confirmation-link')
  async resendActivationLink(@GetCurrentUser('login') login: string): Promise<Message> {
    return await this.#authService.sendConfirmationLink(login);
    // work in progress
  }
}
