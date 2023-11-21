import { Controller, Get, Patch, Delete, Param } from '@nestjs/common';
import { MyAccountService } from '../services/my-account.service';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { GetCurrentUser } from '../../utils/decorators/get-current-user.decorator';
import { Message } from '../../utils/types/message.type';

@Controller('my-account')
@ApiTags('My Account')
export class MyAccountController {
  readonly #myAccountService: MyAccountService;
  constructor(myAccountService: MyAccountService) {
    this.#myAccountService = myAccountService;
  }

  @Get('info')
  getMyInfo(): any {
    return this.#myAccountService.getMyInfo();
  }

  @Patch('change-info')
  changeMyInfo(): any {
    return this.#myAccountService.changeMyInfo();
  }

  @Patch('change-password')
  changeMyPassword(): any {
    return this.#myAccountService.changeMyPassword();
  }

  @Delete('delete')
  deleteMyAccount(): any {
    return this.#myAccountService.deleteMyAccount();
  }

    @ApiExcludeEndpoint()
    @Get('/activate/:verificationCode')
    async activateMyAccount(@GetCurrentUser('sub') userId: number, @Param() verificationCode: string): Promise<Message> {
      return await this.#myAccountService.activateMyAccount(userId, verificationCode);
    }
}
