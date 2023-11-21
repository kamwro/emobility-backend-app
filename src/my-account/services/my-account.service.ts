import { Injectable } from '@nestjs/common';

@Injectable()
export class MyAccountService {
  getMyInfo(): any {
    // work in progress
  }
  changeMyInfo(): any {
    // work in progress
  }
  changeMyPassword(): any {
    // work in progress
  }
  deleteMyAccount(): any {
    // work in progress
  }

  async activateMyAccount(id: number, verificationCode: string): Promise<any> {
    id;
    verificationCode;
    // work in progress
  }
}
