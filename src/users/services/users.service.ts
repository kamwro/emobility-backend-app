import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
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

  async remove(id: number): Promise<void> {
    const user = this.#usersRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException('there is no user with that id');
    }

    await this.#usersRepository.delete(id);
  }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const address = this.#addressRepository.create(createUserDTO.address);
    const user = this.#usersRepository.create({ ...createUserDTO, address });
    return await this.#usersRepository.save(user);
  }

  async updateRefreshToken(userId: number, hash: string | null): Promise<Message> {
    const user = await this.#usersRepository.findOneBy({ id: userId });
    if (user) {
      user.hashedRefreshToken = hash;
      await this.#usersRepository.save(user);
    }
    return { message: 'signed out' };
    // TODO: unit tests
  }
}
