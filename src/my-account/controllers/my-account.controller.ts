import { Controller, Get, Patch, Delete } from '@nestjs/common';
import { MyAccountService } from '../services/my-account.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('my-account')
@ApiTags('My Account')
export class MyAccountController {
  readonly #myAccountService: MyAccountService;
  constructor(myAccountService: MyAccountService) {
    this.#myAccountService = myAccountService;
  }

  //   @Patch('resend-confirmation-link')
  //   async resendActivationLink(@GetCurrentUser('login') login: string): Promise<Message> {
  //     return await this.#authService.sendConfirmationLink(login);
  //   }

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

  //   @ApiExcludeEndpoint()
  //   @Get('/activate/:verificationCode')
  //   async activateMyAccount(@GetCurrentUser('sub') userId: number, @Param() verificationCode: string): Promise<Message> {
  //     return await this.#usersService.activateUser(userId, verificationCode);
  //   }
}
