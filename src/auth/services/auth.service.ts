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
  readonly #authRepository: Repository<Authentication>;
  readonly #usersService: UsersService;
  readonly #dataSource: DataSource;
  constructor(
    @InjectRepository(Authentication)
    authRepository: Repository<Authentication>,
    usersService: UsersService,
    dataSource: DataSource,
  ) {
    this.#authRepository = authRepository;
    this.#usersService = usersService;
    this.#dataSource = dataSource;
  }

  async create(createAuthDto: CreateAuthDTO, queryRunner: QueryRunner): Promise<Authentication> {
    const authentication = this.#authRepository.create(createAuthDto);
    return await queryRunner.manager.save(authentication);
  }

  static async getHash(password: string, saltOrRounds: number = 10): Promise<string> {
    return hash(password, saltOrRounds);
  }

  async registerUser(createUserDto: CreateUserDTO): Promise<User | undefined> {
    const queryRunner = this.#dataSource.createQueryRunner();

    let user: User | undefined = undefined;
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const authentication = await this.create(createUserDto, queryRunner);
      user = await this.#usersService.create(createUserDto, authentication, queryRunner);
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
