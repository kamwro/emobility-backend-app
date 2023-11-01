import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { QueryRunner, Repository } from 'typeorm';
import { User } from '../entities';
import { CreateUserDTO } from '../dtos';
import { Authentication } from 'src/auth/entities';

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
    return this._usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this._usersRepository.delete(id);
  }

  async create(createUserDTO: CreateUserDTO, authentication: Authentication, queryRunner: QueryRunner): Promise<User> {
    const user = this._usersRepository.create({ ...createUserDTO, authentication });
    return queryRunner.manager.save(user);
  }
}
