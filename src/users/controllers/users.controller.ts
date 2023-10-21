import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../services';
import { CreateUserDTO } from '../dtos';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @ApiOperation({ summary: 'Register an account.' })
    @ApiTags('Account Creation')
    @Post('register')
    async register(@Body() body: CreateUserDTO): Promise<any> {
        body
        await this.userService.register()
    }
}
