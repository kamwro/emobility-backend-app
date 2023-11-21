import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { Address } from '../entities/address.entity';
import { Message } from '../../utils/types/message.type';

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
    return await this.#usersRepository.find();
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.#usersRepository.findOneBy({ id });
  }

  async findOneByLogin(login: string): Promise<User | null> {
    return await this.#usersRepository.findOneBy({ login });
  }

  async remove(id: number): Promise<DeleteResult> {
    const user = await this.#usersRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException('there is no user with that id');
    }

    return await this.#usersRepository.delete(id);
  }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const address = this.#addressRepository.create(createUserDTO.address);
    const user = this.#usersRepository.create({ ...createUserDTO, address });
    return await this.#usersRepository.save(user);
  }

  async updateRefreshToken(userId: number, hash: string | null): Promise<Message> {
    const user = await this.#usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('there is no user with that id');
    }

    user.hashedRefreshToken = hash;
    await this.#usersRepository.save(user);
    return { message: 'refreshed token has been updated' };
  }

  async updateVerificationKey(userLogin: string, verificationKey: string): Promise<Message> {
    const user = await this.#usersRepository.findOneBy({ login: userLogin });
    if (!user) {
      throw new NotFoundException('there is no user with that id');
    }
    user.verificationKey = verificationKey;
    await this.#usersRepository.save(user);
    return { message: 'new verification key has been attached' };
  }

  async activate(userId: number, verificationKey: string): Promise<Message> {
    const user = await this.#usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('there is no user with that id');
    }
    if (user.isActive) {
      throw new BadRequestException('user already active');
    }
    if (user.verificationKey !== verificationKey) {
      throw new UnauthorizedException('verification key does not match');
    }
    user.isActive = true;
    await this.#usersRepository.save(user);
    return { message: 'user account activated' };
  }
}
