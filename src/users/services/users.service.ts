import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDTO } from '../dtos/create-user.dto';

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

  async findOne(id: number): Promise<User | null> {
    return await this.#usersRepository.findOneBy({ id });
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
    const user = this.#usersRepository.create({ ...createUserDTO });
    return await this.#usersRepository.save(user);
  }
}
