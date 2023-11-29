import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDTO } from '../../users/dtos/create-user.dto';
import { hash, compare } from 'bcrypt';
import { UserSignInDTO } from '../../users/dtos/user-sign-in.dto';
import { Tokens } from '../../utils/types/tokens.type';
import { UserRegisterInfo } from '../../utils/types/user-register-info.type';
import { Message } from '../../utils/types/message.type';
import { JwtPayload } from '../../utils/types/jwt-payload.type';
import { EmailService } from '../../email/services/email.service';

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

    const userInfo = {
      login: user.login,
      firstName: user.firstName,
      lastName: user.lastName,
      birthday: user.birthday,
      address: {
        country: user.address.country,
        city: user.address.city,
        street: user.address.street,
        postalCode: user.address.postalCode,
        buildingNumber: user.address.buildingNumber,
      },
    }; // need to find a better way to transfer data from user to a UserDTO object

    return { info: userInfo, message: 'activation link has been sent' };
  }

  async signIn(userSignInDTO: UserSignInDTO): Promise<Tokens> {
    const user = await this.#usersService.findOneByLogin(userSignInDTO.login);
    if (!user) {
      throw new NotFoundException('user with that login does not exist');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('user not active');
    }

    if (user.hashedRefreshToken) {
      throw new UnauthorizedException('user already signed in');
    }

    const isMatch = await compare(userSignInDTO.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('invalid password');
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
    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('user not active');
    }

    if (!user.hashedRefreshToken) {
      throw new UnauthorizedException('no refresh token active');
    }

    const isMatch = await compare(refreshToken, user.hashedRefreshToken);
    if (!isMatch) {
      throw new UnauthorizedException('tokens do not match');
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
      body: `http://localhost:${this.#configService.get('NEST_API_PORT')}/my-account/activate/${verificationKey}`,
    });
    return { message: 'confirmation link has been send' };
  }
  
}
