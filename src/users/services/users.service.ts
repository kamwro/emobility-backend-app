import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { hash } from 'bcrypt';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { Address } from '../entities/address.entity';
import { Message } from '../../utils/types/message.type';
import { ChangeInfoDTO } from '../../my-account/dtos/change-info.dto';

@Injectable()
export class UsersService {
  readonly #usersRepository: Repository<User>;
  readonly #addressRepository: Repository<Address>;
  constructor(
    @InjectRepository(User)
    usersRepository: Repository<User>,
    @InjectRepository(Address)
    addressRepository: Repository<Address>,
  ) {
    this.#usersRepository = usersRepository;
    this.#addressRepository = addressRepository;
  }

  async findAll(): Promise<User[]> {
    return await this.#usersRepository.find({ relations: { address: true } });
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.#usersRepository.findOne({ where: { id: id }, relations: { address: true } });
  }

  async findOneByLogin(login: string): Promise<User | null> {
    return await this.#usersRepository.findOne({ where: { login: login }, relations: { address: true } });
  }

  async remove(id: number): Promise<Message> {
    const user = await this.#usersRepository.findOneBy({ id: id });
    if (!user) {
      throw new UnauthorizedException('access denied');
    }
    await this.#usersRepository.delete(id);
    return { message: 'user deleted' };
  }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const address = this.#addressRepository.create(createUserDTO.address);
    const user = this.#usersRepository.create({ ...createUserDTO, address });
    return await this.#usersRepository.save(user);
  }

  async updateRefreshToken(userId: number, hash: string | null): Promise<Message> {
    const user = await this.#usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('access denied');
    }

    user.hashedRefreshToken = hash;
    await this.#usersRepository.save(user);
    return { message: 'refreshed token has been updated' };
  }

  async updateVerificationKey(userLogin: string, verificationKey: string): Promise<Message> {
    const user = await this.#usersRepository.findOneBy({ login: userLogin });
    if (!user) {
      throw new UnauthorizedException('access denied');
    }
    user.verificationKey = verificationKey;
    await this.#usersRepository.save(user);
    return { message: 'new verification key has been attached' };
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

  async updatePassword(userId: number, newPlainPassword: string): Promise<Message> {
    const user = await this.#usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('access denied');
    }
    const newHashedPassword = await hash(newPlainPassword, 10);
    user.password = newHashedPassword;

    await this.#usersRepository.save(user);
    return { message: 'password has been successfully changed' };
  }

  async updateInfo(userId: number, infoToChange: ChangeInfoDTO): Promise<Message> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException('access denied');
    }
    user.firstName = infoToChange.firstName;
    user.lastName = infoToChange.lastName;
    user.address.country = infoToChange.address.country;
    user.address.city = infoToChange.address.city;
    user.address.street = infoToChange.address.street;
    user.address.postalCode = infoToChange.address.postalCode;
    user.address.buildingNumber = infoToChange.address.buildingNumber;

    await this.#usersRepository.save(user);
    return { message: 'user data has been successfully changed' };
  }
}
