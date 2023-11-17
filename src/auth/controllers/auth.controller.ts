import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { CreateUserDTO } from '../../users/dtos/create-user.dto';
import { UserSignInDTO } from '../../users/dtos/user-sign-in.dto';
import { Tokens } from '../../utils/types/tokens.type';
import { UserInfo } from '../../utils/types/user-info.type';
import { Message } from '../../utils/types/message.type';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUser } from '../../utils/decorators/get-current-user.decorator';

@Controller('auth')
export class AuthController {
  readonly #authService: AuthService;
  constructor(authService: AuthService) {
    this.#authService = authService;
  }

  @ApiOperation({ summary: 'Register an account.' })
  @ApiTags('Account Creation')
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Successfully created an account' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error - email is probably already taken' })
  async register(@Body() body: CreateUserDTO): Promise<UserInfo> {
    return await this.#authService.registerUser(body);
  }

  @ApiOperation({ summary: 'Login to receive an access token.' })
  @ApiTags('Authentication')
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Successfully signed in' })
  async signIn(@Body() body: UserSignInDTO): Promise<Tokens> {
    return await this.#authService.signIn(body);
  }

  @ApiOperation({ summary: 'Logout from the current session.' })
  @ApiTags('Authentication')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Successfully signed out' })
  async signOut(@GetCurrentUser('sub') userId: number): Promise<Message> {
    return await this.#authService.signOut(userId);
  }

  @ApiOperation({ summary: 'Refresh the session.' })
  @ApiTags('Authentication')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Successfully refreshed the session' })
  async refresh(@GetCurrentUser('sub') userId: number, @GetCurrentUser('refreshToken') refreshToken: string): Promise<Tokens> {
    return await this.#authService.refreshTokens(userId, refreshToken);
  }
}
