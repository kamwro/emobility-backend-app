import { Controller, Get, Patch, Delete } from '@nestjs/common';
import { MyAccountService } from '../services/me.service';
import { ApiTags } from '@nestjs/swagger';


@Controller('me')
@ApiTags("My Account")
export class MyAccountController {
    constructor(private readonly myAccountService: MyAccountService) { }

    @Get('info')
    getMyInfo(): any {
        return this.myAccountService.getMyInfo()
    }

    @Patch('change-info')
    changeMyInfo(): any {
        return this.myAccountService.changeMyInfo()
    }

    @Patch('change-password')
    changeMyPassword(): any {
        return this.myAccountService.changeMyPassword()
    }

    @Delete('delete')
    deleteMyAccount(): any {
        return this.myAccountService.deleteMyAccount()
    }
}
