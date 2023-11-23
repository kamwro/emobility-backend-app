import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';
import { CreateUserDTO } from '../../users/dtos/create-user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
  readonly #usersService: UsersService;
  constructor(usersService: UsersService) {
    this.#usersService = usersService;
  }

  static async getHash(password: string, saltOrRounds: number = 10): Promise<string> {
    return hash(password, saltOrRounds);
  }

  async registerUser(createUserDto: CreateUserDTO): Promise<User | undefined> {
    let user: User | undefined = undefined;

    try {
      user = await this.#usersService.create(createUserDto);
    } catch (e) {
      throw new InternalServerErrorException('email already taken');
    }
    // TODO: sending an email with verification link
    return user;
  }

  logIn(): any {
    // work in progress
  }
  logOut(): any {
    // work in progress
  }
}
