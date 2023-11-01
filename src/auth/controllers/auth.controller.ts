import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { AuthService } from '../services';
import { CreateAuthDTO } from '../dtos';
import { User } from 'src/users/entities';
import { CreateUserDTO, UserDTO } from 'src/users/dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @ApiOperation({ summary: 'Register an account.' })
  @ApiTags('Account Creation')
  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDTO, description: 'Successfully created an account' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error - email is probably already taken' })
  async register(@Body() body: CreateUserDTO): Promise<User | undefined> {
    return await this._authService.registerUser(body);
  }

  @ApiOperation({ summary: 'Login to receive an access token.' })
  @ApiTags('Authentication')
  @Post('log-in')
  async logIn(@Body() body: CreateAuthDTO): Promise<any> {
    body;
    await this._authService.logIn();
  }

  @ApiOperation({ summary: 'Logout from the current session.' })
  @ApiTags('Authentication')
  @Post('log-out')
  async logOut(): Promise<any> {
    await this._authService.logOut();
  }
}
