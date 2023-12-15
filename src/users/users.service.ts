import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { hash, compare } from 'bcrypt';
import { CreateUserDTO } from './dtos/create-user.dto';
import { Message } from '../utils/types/message.type';
import { ChangeInfoDTO } from '../my-account/dtos/change-info.dto';

@Injectable()
export class UsersService {
  readonly #usersRepository: Repository<User>;
  constructor(
    @InjectRepository(User)
    usersRepository: Repository<User>,
  ) {
    this.#usersRepository = usersRepository;
  }

  async findAll(): Promise<User[]> {
    return await this.#usersRepository.find();
  }

  async findOneById(userId: number): Promise<User | null> {
    return await this.#usersRepository.findOneBy({ id: userId });
  }

  async findOneByLogin(login: string): Promise<User | null> {
    return await this.#usersRepository.findOneBy({ login: login });
  }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const user = this.#usersRepository.create(createUserDTO);
    return await this.#usersRepository.save(user);
  }

  async remove(userId: number): Promise<Message | null> {
    const user = await this.#usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('access denied');
    }
    await this.#usersRepository.delete(userId);

    return { message: 'user deleted' };
  }

  async activate(verificationCode: string): Promise<Message> {
    const user = await this.#usersRepository.findOneBy({ verificationKey: verificationCode });
    if (!user || user.verificationKey !== verificationCode) {
      throw new UnauthorizedException('access denied');
    }

    if (user.isActive) {
      throw new BadRequestException('user already active');
    }

    user.isActive = true;
    await this.#usersRepository.save(user);

    return { message: 'user account activated' };
  }

  async updateRefreshToken(userId: number, hash: string | null): Promise<Message> {
    const user = await this.#usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('access denied');
    }

    user.refreshToken = hash;
    await this.#usersRepository.save(user);

    return { message: 'refreshed token has been updated' };
  }

  async updateVerificationKey(login: string, verificationKey: string): Promise<Message> {
    const user = await this.#usersRepository.findOneBy({ login: login });
    if (!user) {
      throw new UnauthorizedException('access denied');
    }
    user.verificationKey = verificationKey;
    await this.#usersRepository.save(user);

    return { message: 'new verification key has been attached' };
  }

  async updatePassword(userId: number, oldPlainPassword: string, newPlainPassword: string): Promise<Message | null> {
    const user = await this.#usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('access denied');
    }
    const isMatch = await compare(oldPlainPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('invalid password');
    }

    const newHashedPassword = await hash(newPlainPassword, 10);
    user.password = newHashedPassword;

    await this.#usersRepository.save(user);

    return { message: 'password has been successfully changed' };
  }

  async updateInfo(userId: number, infoToChange: ChangeInfoDTO): Promise<Message | null> {
    let user = await this.#usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('access denied');
    }

    let info: keyof ChangeInfoDTO;
    for (info in infoToChange) {
      user[info] = infoToChange[info];
    }

    await this.#usersRepository.save(user);

    return { message: 'user data has been successfully changed' };
  }
}
