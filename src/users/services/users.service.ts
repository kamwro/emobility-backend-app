import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { Authentication } from '../../auth/entities/auth.entity';
import { TypeORMError } from 'typeorm';

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

  async create(createUserDTO: CreateUserDTO, authentication: Authentication | undefined): Promise<User | undefined> {
    let user: User | undefined = undefined;
    try {
      user = this.#usersRepository.create({ ...createUserDTO, authentication });
      return await this.#usersRepository.save(user);
    } catch (e) {
      throw new TypeORMError('something went wrong');
    } finally {
      return user;
    }
  }
}
