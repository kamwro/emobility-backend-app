import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { Address } from '../entities/address.entity';

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
    const user = this.#usersRepository.findOneBy({ id });
    if (user !== null) {
      await this.#usersRepository.delete(id);
    } else {
      throw new NotFoundException('there is no user with that id');
    }
  }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const address = this.#addressRepository.create(createUserDTO.address);
    const user = this.#usersRepository.create({ ...createUserDTO, address });
    return await this.#usersRepository.save(user);
  }
}
