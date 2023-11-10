import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services';
import { CreateAuthDTO } from '../dtos';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: 'Login to receive an access token.' })
    @Post('log-in')
    async logIn(@Body() body: CreateAuthDTO): Promise<any> {
        body
        await this.authService.logIn()
    }

    @ApiOperation({ summary: 'Logout from the current session.' })
    @Post('log-out')
    async logOut(): Promise<any> {
        await this.authService.logOut()
    }
}
