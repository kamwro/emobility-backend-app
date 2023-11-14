import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, QueryRunner } from 'typeorm';
import { Authentication } from '../entities/auth.entity';
import { CreateAuthDTO } from '../dtos/create-auth.dto';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';
import { CreateUserDTO } from '../../users/dtos/create-user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Authentication)
    private readonly _authRepository: Repository<Authentication>,
    private readonly _usersService: UsersService,
    private readonly _dataSource: DataSource,
  ) {}

  async create(createAuthDto: CreateAuthDTO, queryRunner: QueryRunner): Promise<Authentication> {
    const authentication = this._authRepository.create(createAuthDto);
    return queryRunner.manager.save(authentication);
  }

  static async getHash(password: string, saltOrRounds: number = 10): Promise<string> {
    return hash(password, saltOrRounds);
  }

  async registerUser(createUserDto: CreateUserDTO): Promise<User | undefined> {
    const queryRunner = this._dataSource.createQueryRunner();

    let user: User | undefined = undefined;
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const authentication = await this.create(createUserDto, queryRunner);
      user = await this._usersService.create(createUserDto, authentication, queryRunner);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('email already taken');
    } finally {
      await queryRunner.release();
    }
    // TODO: sending an email with verification link
    return user;
  }

  logIn(): any {
    // work in progress
  }
  logOut(): any {
    // work in progress
  }
}
