import { Injectable, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { QueryRunner, Repository } from 'typeorm';
import { User } from '../entities';
import { CreateUserDTO } from '../dtos';
import { Authentication } from 'src/auth/entities';
import { TypeORMError } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly _usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this._usersRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    if (typeof id !== 'number') {
      throw new UnprocessableEntityException('id must be of type number');
    }
    return this._usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne((id = id));
    if (typeof id !== 'number') {
      throw new UnprocessableEntityException('id must be of type number');
    } else if (user !== null) {
      await this._usersRepository.delete(id);
    } else {
      throw new NotFoundException('there is no user with that id');
    }
  }

  async create(createUserDTO: CreateUserDTO, authentication: Authentication | undefined, queryRunner: QueryRunner): Promise<User | undefined> {
    let user: User | undefined = undefined;
    try {
      user = this._usersRepository.create({ ...createUserDTO, authentication });
      return queryRunner.manager.save(user);
    } catch (e) {
      throw new TypeORMError('something went wrong with provided dto or authentication entity');
    } finally {
      return user;
    }
  }
}
