import { Controller, Get, Post, Body, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiCreatedResponse, ApiOkResponse, ApiBearerAuth, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../users/dtos/create-user.dto';
import { UserSignInDTO } from '../users/dtos/user-sign-in.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUser } from '../utils/decorators/get-current-user.decorator';
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
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async register(@Body() body: CreateUserDTO, @Res() res: Response): Promise<Response> {
    const message = await this.#authService.registerUser(body);
    if (!message) {
      return res.status(HttpStatus.BAD_REQUEST);
    }
    return res.status(HttpStatus.CREATED).json(message);
  }

  @ApiOperation({ summary: 'Login to receive an access token.' })
  @ApiTags('Authentication')
  @Post('login')
  @ApiOkResponse({ description: 'Successfully signed in' })
  @ApiUnauthorizedResponse({ description: 'Access denied' })
  @ApiBadRequestResponse({ description: 'User already signed in' })
  async signIn(@Body() body: UserSignInDTO, @Res() res: Response): Promise<Response> {
    const tokens = await this.#authService.signIn(body);
    if (!tokens) {
      return res.status(HttpStatus.UNAUTHORIZED);
    }
    return res.status(HttpStatus.OK).json(tokens);
  }

  @ApiOperation({ summary: 'Logout from the current session.' })
  @ApiTags('Authentication')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  @ApiOkResponse({ description: 'Successfully signed out' })
  @ApiUnauthorizedResponse({ description: 'Access denied' })
  @ApiNotFoundResponse({ description: 'User is not signed in' })
  async signOut(@GetCurrentUser('sub') userId: number, @Res() res: Response): Promise<Response> {
    const message = await this.#authService.signOut(userId);
    if (!message) {
      return res.status(HttpStatus.NOT_FOUND);
    }
    return res.status(HttpStatus.OK).json(message);
  }

  @ApiOperation({ summary: 'Refresh the session.' })
  @ApiTags('Authentication')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh')
  @ApiOkResponse({ description: 'Successfully refreshed the session' })
  @ApiUnauthorizedResponse({ description: 'Access denied' })
  async refresh(@GetCurrentUser('sub') userId: number, @GetCurrentUser('refreshToken') refreshToken: string, @Res() res: Response): Promise<Response> {
    const tokens = await this.#authService.refreshTokens(userId, refreshToken);
    if (!tokens) {
      return res.status(HttpStatus.UNAUTHORIZED);
    }
    return res.status(HttpStatus.OK).json(tokens);
  }

  // @Patch('resend-confirmation-link')
  // async resendActivationLink(@GetCurrentUser('login') login: string): Promise<Message> {
  //   return await this.#authService.sendConfirmationLink(login);
  //   // work in progress
  // }
}
