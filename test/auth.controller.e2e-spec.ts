import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createUserDTOMock } from '../src/utils/shared-mocks/create-user.dto.mock';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/users/user.entity';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const URL = '/auth';
  let usersRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRootAsync({
          useFactory: () => ({ type: 'sqlite', database: ':memory:', entities: [User], synchronize: true }),
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  describe('/POST auth/register', () => {
    it('should register user with valid data', async () => {
      await request(app.getHttpServer())
        .post(`${URL}/register`)
        .send(createUserDTOMock)
        .expect(HttpStatus.CREATED)
        .expect((response: request.Response) => {
          const info = response.body.info;
          expect(info).toBeDefined();
          expect(info.firstName).toBe(createUserDTOMock.firstName);
          expect(info.lastName).toBe(createUserDTOMock.lastName);
          expect(info.birthday).toBe(createUserDTOMock.birthday);
          expect(info.login).toBe(createUserDTOMock.login);
          expect(info.country).toBe(createUserDTOMock.country);
          expect(info.city).toBe(createUserDTOMock.city);
          expect(info.postalCode).toBe(createUserDTOMock.postalCode);
          expect(info.street).toBe(createUserDTOMock.street);
          expect(info.buildingNumber).toBe(createUserDTOMock.buildingNumber);
        });
    });

    it('should not register when using already taken email', async () => {
      await request(app.getHttpServer()).post(`${URL}/register`).send(createUserDTOMock).expect(HttpStatus.BAD_REQUEST);
    });

    usersRepository.query(`DELETE FROM users WHERE login=${createUserDTOMock.login}`);
  });

  // it('/POST auth/login', () => {
  //   return request(app.getHttpServer()).post('/auth/login').expect(HttpStatus.UNAUTHORIZED);
  // }); // not active

  // it('/PATCH auth/resend-confirmation-link', () => {
  //   return request(app.getHttpServer()).patch('/auth/resend-confirmation-link').expect(HttpStatus.OK);
  // });

  // it('/GET auth/activate/:verificationCode', () => {
  //   return request(app.getHttpServer()).get('/auth/activate:verificationCode').expect(HttpStatus.OK);
  // });

  // it('/POST auth/login', () => {
  //   return request(app.getHttpServer()).post('/auth/login').expect(HttpStatus.UNAUTHORIZED);
  // }); // active but invalid token

  // it('/POST auth/login', () => {
  //   return request(app.getHttpServer()).post('/auth/login').expect(HttpStatus.OK);
  // });

  // it('/GET auth/logout', () => {
  //   return request(app.getHttpServer()).get('/auth/logout').expect(HttpStatus.OK);
  // });

  // it('/POST auth/login', () => {
  //   return request(app.getHttpServer()).post('/auth/login').expect(HttpStatus.OK);
  // });

  // it('/GET auth/refresh', () => {
  //   return request(app.getHttpServer()).get('/auth/refresh').expect(HttpStatus.OK);
  // });
});
