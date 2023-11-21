import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDTO } from '../../users/dtos/create-user.dto';
import { hash, compare } from 'bcryptjs';
import { UserSignInDTO } from '../../users/dtos/user-sign-in.dto';
import { Tokens } from '../../utils/types/tokens.type';
import { UserRegisterInfo } from '../../utils/types/user-register-info.type';
import { Message } from '../../utils/types/message.type';
import { JwtPayload } from '../../utils/types/jwt-payload.type';

@Injectable()
export class AuthService {
  readonly #usersService: UsersService;
  readonly #jwtService: JwtService;
  readonly #configService: ConfigService;
  constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService) {
    this.#usersService = usersService;
    this.#jwtService = jwtService;
    this.#configService = configService;
  }

  async registerUser(createUserDto: CreateUserDTO): Promise<UserRegisterInfo> {
    let user: User;
    try {
      const hashedPassword = await this.getHash(createUserDto.password);
      user = await this.#usersService.create({ ...createUserDto, password: hashedPassword });
    } catch (e) {
      throw new InternalServerErrorException('email already taken');
    }
    const verificationKey = await this.getVerificationToken(user.login);
    await this.#usersService.updateVerificationKey(user.login, verificationKey);
    // TODO: sending an email with verification link
    return { info: user, message: 'activation link has been sent' };
  }

  async signIn(userSignInDTO: UserSignInDTO): Promise<Tokens> {
    const user = await this.#usersService.findOneByLogin(userSignInDTO.login);
    if (!user) {
      throw new NotFoundException('user with that id does not exist');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('user not active');
    }

    if (user.hashedRefreshToken) {
      throw new BadRequestException('user already signed in');
    }

    if (!(await compare(userSignInDTO.password, user.password))) {
      throw new UnauthorizedException('invalid password');
    }

    const payload = { sub: user.id, login: user.login };
    const tokens = await this.getTokens(payload);
    await this.saveNotNullRefreshTokenToUser(user.id, tokens.refreshToken);
    return tokens;

    // TODO: unit tests
  }

  async signOut(userId: number): Promise<Message> {
    const user = await this.#usersService.findOneById(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new NotFoundException('user is not logged in');
    }
    return await this.#usersService.updateRefreshToken(userId, null);
    // TODO: unit tests
  }

  async refreshTokens(userId: number, refreshToken: string): Promise<Tokens> {
    const user = await this.#usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (!user.hashedRefreshToken) {
      throw new UnauthorizedException('access denied - no refresh token active');
    }
    const isMatch = await compare(refreshToken, user.hashedRefreshToken);
    if (!isMatch) {
      throw new UnauthorizedException('access denied - tokens dont match');
    }

    const tokens = await this.getTokens({ sub: user.id, login: user.login });
    await this.saveNotNullRefreshTokenToUser(user.id, tokens.refreshToken);

    return tokens;
    // TODO: unit tests
  }

  async getTokens(payload: JwtPayload): Promise<Tokens> {
    const tokens = await Promise.all([
      this.#jwtService.signAsync(payload, {
        secret: this.#configService.get('ACCESS_JWT_SECRET'),
        expiresIn: this.#configService.get('ACCESS_TOKEN_EXPIRES_IN_MIN') * 60,
      }),
      this.#jwtService.signAsync(payload, {
        secret: this.#configService.get('REFRESH_JWT_SECRET'),
        expiresIn: this.#configService.get('REFRESH_TOKEN_EXPIRES_IN_DAY') * 60 * 60 * 24,
      }),
    ]);

    return { accessToken: tokens[0], refreshToken: tokens[1] };
    // TODO: unit tests
  }

  async saveNotNullRefreshTokenToUser(userId: number, plainToken: string): Promise<Message> {
    const hashedToken = await this.getHash(plainToken);
    return await this.#usersService.updateRefreshToken(userId, hashedToken);
    // TODO: unit tests
  }

  async getHash(password: string, saltOrRounds: number = 10): Promise<string> {
    return await hash(password, saltOrRounds);
  }

  async getVerificationToken(userLogin: string): Promise<string> {
    const verificationToken = this.#jwtService.sign(
      { userLogin },
      {
        secret: this.#configService.get('VERIFICATION_JWT_SECRET'),
        expiresIn: this.#configService.get('VERIFICATION_TOKEN_EXPIRES_IN_SEC'),
      },
    );
    return verificationToken;
    // TODO: unit tests
  }

  async sendConfirmationLink(userLogin: string): Promise<Message> {
    const verificationKey = await this.getVerificationToken(userLogin)
    await this.#usersService.updateVerificationKey(userLogin, verificationKey);
    return {'message': 'confirmation link has been send'}
    // TODO: unit tests
  }
}
