import { Controller, Get, Patch, Delete } from '@nestjs/common';
import { MeService } from '../services/me.service';
import { ApiTags } from '@nestjs/swagger';


@Controller('me')
@ApiTags("My Account")
export class MeController {
    constructor(private readonly meService: MeService) { }

    @Get('info')
    getMyInfo(): any {
        return this.meService.getMyInfo()
    }

    @Patch('change-info')
    changeMyInfo(): any {
        return this.meService.changeMyInfo()
    }

    @Patch('change-password')
    changeMyPassword(): any {
        return this.meService.changeMyPassword()
    }

    @Delete('delete')
    deleteMyAccount(): any {
        return this.meService.deleteMyAccount()
    }
}
