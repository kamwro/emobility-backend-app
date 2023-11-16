import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from '../../users/dtos/create-user.dto';
import { hash, compare } from 'bcryptjs';
import { UserSignInDTO } from '../../users/dtos/user-sign-in.dto';

@Injectable()
export class AuthService {
  readonly #usersService: UsersService;
  readonly #jwtService: JwtService;
  constructor(usersService: UsersService, jwtService: JwtService) {
    this.#usersService = usersService;
    this.#jwtService = jwtService;
  }

  static async getHash(password: string, saltOrRounds: number = 10): Promise<string> {
    return await hash(password, saltOrRounds);
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

  async signIn(userSignInDTO: UserSignInDTO): Promise<{ access_token: string }> {
    let isMatch: boolean;
    const user = await this.#usersService.findOneByLogin(userSignInDTO.login);
    if (user?.password) {
      isMatch = await compare(userSignInDTO.password, user.password);
    } else throw new NotFoundException('user not found');
    if (!isMatch) {
      throw new UnauthorizedException('invalid password');
    }
    const payload = { sub: user.id, username: user.login };
    return {
      access_token: await this.#jwtService.signAsync(payload),
    };
  }
  signOut(): any {
    // work in progress
  }
}
