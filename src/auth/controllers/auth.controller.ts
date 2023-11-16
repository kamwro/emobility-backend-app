import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { User } from '../../users/entities/user.entity';
import { UserDTO } from '../../users/dtos/user.dto';
import { CreateUserDTO } from '../../users/dtos/create-user.dto';
import { UserSignInDTO } from '../../users/dtos/user-sign-in.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
export class AuthController {
  readonly #authService: AuthService;
  constructor(authService: AuthService) {
    this.#authService = authService;
  }

  @ApiOperation({ summary: 'Register an account.' })
  @ApiTags('Account Creation')
  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDTO, description: 'Successfully created an account' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error - email is probably already taken' })
  async register(@Body() body: CreateUserDTO): Promise<User | undefined> {
    return await this.#authService.registerUser(body);
  }

  @ApiOperation({ summary: 'Login to receive an access token.' })
  @ApiTags('Authentication')
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDTO, description: 'Successfully signed in' })
  async signIn(@Body() body: UserSignInDTO): Promise<{ access_token: string }> {
    return await this.#authService.signIn(body);
  }

  @ApiOperation({ summary: 'Logout from the current session.' })
  @ApiTags('Authentication')
  @UseGuards(AuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async signOut(): Promise<any> {
    await this.#authService.signOut();
  }
}
