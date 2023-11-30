import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDTO } from '../users/dtos/create-user.dto';
import { hash, compare } from 'bcrypt';
import { UserSignInDTO } from '../users/dtos/user-sign-in.dto';
import { Tokens } from '../utils/types/tokens.type';
import { UserRegisterInfo } from '../utils/types/user-register-info.type';
import { Message } from '../utils/types/message.type';
import { JwtPayload } from '../utils/types/jwt-payload.type';
import { EmailService } from '../email/email.service';
import { UserDTO } from '../users/dtos/user.dto';

@Injectable()
export class AuthService {
  readonly #usersService: UsersService;
  readonly #emailService: EmailService;
  readonly #jwtService: JwtService;
  readonly #configService: ConfigService;
  constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, emailService: EmailService) {
    this.#usersService = usersService;
    this.#emailService = emailService;
    this.#jwtService = jwtService;
    this.#configService = configService;
  }

  async registerUser(createUserDto: CreateUserDTO): Promise<UserRegisterInfo> {
    let user: User;
    try {
      const hashedPassword = await hash(createUserDto.password, 10);
      user = await this.#usersService.create({ ...createUserDto, password: hashedPassword });
    } catch (e) {
      throw new BadRequestException('email already taken');
    }
    await this.sendConfirmationLink(user.login);

    const userInfo: UserDTO = {
      login: user.login,
      firstName: user.firstName,
      lastName: user.lastName,
      birthday: user.birthday,
      country: user.country,
      city: user.city,
      street: user.street,
      postalCode: user.postalCode,
      buildingNumber: user.buildingNumber,
    };

    return { info: userInfo, message: 'activation link has been sent' };
  }

  async signIn(userSignInDTO: UserSignInDTO): Promise<Tokens> {
    const user = await this.#usersService.findOneByLogin(userSignInDTO.login);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('access denied');
    }

    if (user.hashedRefreshToken) {
      throw new BadRequestException('user already signed in');
    }

    const isMatch = await compare(userSignInDTO.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('access denied');
    }

    const payload = { sub: user.id, login: user.login };
    const tokens = await this.getTokens(payload);

    const hashedRefreshToken = await hash(tokens.refreshToken, 10);
    await this.#usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return tokens;
  }

  async signOut(userId: number): Promise<Message> {
    const user = await this.#usersService.findOneById(userId);
    if (!user?.hashedRefreshToken) {
      throw new NotFoundException('user is not logged in');
    }
    await this.#usersService.updateRefreshToken(userId, null);
    return { message: 'signed out' };
  }

  async refreshTokens(userId: number, refreshToken: string): Promise<Tokens> {
    const user = await this.#usersService.findOneById(userId);

    if (!user || !user.isActive || !user.hashedRefreshToken) {
      throw new UnauthorizedException('access denied');
    }

    const isMatch = await compare(refreshToken, user.hashedRefreshToken);
    if (!isMatch) {
      throw new UnauthorizedException('access denied');
    }

    const payload = { sub: userId, login: user.login };
    const tokens = await this.getTokens(payload);

    const hashedRefreshToken = await hash(tokens.refreshToken, 10);
    await this.#usersService.updateRefreshToken(userId, hashedRefreshToken);

    return tokens;
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
  }

  async getVerificationToken(userLogin: string): Promise<string> {
    const verificationToken = this.#jwtService.signAsync(
      { userLogin },
      {
        secret: this.#configService.get('VERIFICATION_JWT_SECRET'),
        expiresIn: this.#configService.get('VERIFICATION_TOKEN_EXPIRES_IN_SEC'),
      },
    );
    return verificationToken;
  }

  async sendConfirmationLink(userLogin: string): Promise<Message> {
    const verificationKey = await this.getVerificationToken(userLogin);
    await this.#usersService.updateVerificationKey(userLogin, verificationKey);
    await this.#emailService.sendEmail({
      recipient: userLogin,
      subject: 'Your Confirmation Link',
      body: `http://localhost:${this.#configService.get('NEST_API_PORT')}/auth/activate/${verificationKey}`,
    });
    return { message: 'confirmation link has been send' };
  }

  async activateUser(verificationCode: string): Promise<Message> {
    try {
      await this.#jwtService.verifyAsync(verificationCode, { secret: this.#configService.get('VERIFICATION_JWT_SECRET') });
    } catch (e) {
      throw new UnauthorizedException('access denied');
    }
    return this.#usersService.activate(verificationCode);
  }
}
