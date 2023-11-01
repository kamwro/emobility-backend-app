import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, QueryRunner } from 'typeorm';
import { Authentication } from '../entities';
import { CreateAuthDTO } from '../dtos';
import { User } from 'src/users/entities';
import { UsersService } from 'src/users/services';
import { CreateUserDTO } from 'src/users/dtos';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Authentication)
    private readonly _authRepository: Repository<Authentication>,
    private readonly _usersService: UsersService,
    private readonly _dataSource: DataSource,
  ) {}

  private async _create(createAuthDto: CreateAuthDTO, queryRunner: QueryRunner): Promise<Authentication> {
    const authentication = this._authRepository.create(createAuthDto);

    return queryRunner.manager.save(authentication);
  }

  async registerUser(createUserDto: CreateUserDTO): Promise<User | undefined> {
    const queryRunner = this._dataSource.createQueryRunner();

    let user: User | undefined = undefined;
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const authentication = await this._create(createUserDto, queryRunner);
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
