import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createUserDTOMock } from '../src/utils/shared-mocks/create-user.dto.mock';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../src/users/user.entity';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app/app.module';
import { hash } from 'bcrypt';

const dbConfig = { type: 'sqlite', database: ':memory:', entities: [User], synchronize: true, dropSchema: true };

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  const URL = '/auth';

  const setupUser = async () => {
    const password = createUserDTOMock.password;
    const hashedPassword = await hash(password, 10);
    // todo - get correct value for verification key, through JwtService or AuthService
    const user = userRepository.create({ ...createUserDTOMock, password: hashedPassword });
    return await userRepository.save(user);
  };

  const setupActiveUser = async () => {
    const user = await setupUser();
    user.isActive = true;
    return await userRepository.save(user);
  };

  const getTokens = async () => {
    let tokens = { accessToken: 'null', refreshToken: 'null' };
    await setupActiveUser();
    await request(app.getHttpServer())
      .post(`${URL}/login`)
      .send({ login: createUserDTOMock.login, password: createUserDTOMock.password })
      .expect((response: request.Response) => {
        tokens = response.body;
      });
    return tokens;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => dbConfig as TypeOrmModuleOptions,
        }),
        TypeOrmModule.forFeature([User]),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get('UserRepository');

    app.useGlobalPipes(new ValidationPipe({}));

    await app.init();
  });

  afterEach(async () => {
    await userRepository.query('DELETE FROM users');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/POST auth/register', () => {
    it('should register user with valid data', async () => {
      await request(app.getHttpServer())
        .post(`${URL}/register`)
        .send(createUserDTOMock)
        .set('accept', '*/*')
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.CREATED)
        .expect((response: request.Response) => {
          const info = response.body.info;
          expect(createUserDTOMock).toMatchInlineSnapshot(
            { ...info },
            `
        {
          "birthday": "2000-01-01",
          "buildingNumber": "test",
          "city": "test",
          "country": "test",
          "firstName": "test",
          "lastName": "test",
          "login": "test@test.test",
          "password": "T3sdT%$#",
          "postalCode": "test",
          "street": "test",
          "verificationKey": "test",
        }
        `,
          );
        });
    });

    it('should not register when using already taken email', async () => {
      await setupUser();
      await request(app.getHttpServer())
        .post(`${URL}/register`)
        .send(createUserDTOMock)
        .set('accept', '*/*')
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not register with invalid data', async () => {
      await request(app.getHttpServer()).post(`${URL}/register`).set('accept', '*/*').set('Content-Type', 'application/json').expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/POST auth/login', () => {
    it('should login active user', async () => {
      await setupActiveUser();
      await request(app.getHttpServer())
        .post(`${URL}/login`)
        .send({ login: createUserDTOMock.login, password: createUserDTOMock.password })
        .set('accept', '*/*')
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.OK)
        .expect((response: request.Response) => {
          expect(response.body.accessToken).toBeDefined();
          expect(response.body.refreshToken).toBeDefined();
        });
    });

    it('should not login inactive user', async () => {
      await setupUser();
      await request(app.getHttpServer())
        .post(`${URL}/login`)
        .send({ login: createUserDTOMock.login, password: createUserDTOMock.password })
        .set('accept', '*/*')
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/GET auth/logout', () => {
    it('should sign out after signing in', async () => {
      const accessToken = (await getTokens()).accessToken;

      await request(app.getHttpServer())
        .get(`${URL}/logout`)
        .auth(accessToken, { type: 'bearer' })
        .set('accept', '*/*')
        .expect(HttpStatus.OK)
        .expect((response: request.Response) => {
          const message = response.body;
          expect(message).toBeDefined();
        });
    });

    it('trying to logout while not signed in should throw', async () => {
      await request(app.getHttpServer()).get(`${URL}/logout`).set('accept', '*/*').expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/GET auth/refresh', () => {
    it('should refresh a session', async () => {
      const refreshToken = (await getTokens()).refreshToken;

      await request(app.getHttpServer()).get(`${URL}/refresh`).auth(refreshToken, { type: 'bearer' }).set('accept', '*/*').expect(HttpStatus.OK);
    });

    it('should not refresh a session when unauthorized', async () => {
      await setupActiveUser();
      await request(app.getHttpServer()).get(`${URL}/refresh`).set('accept', '*/*').expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/PATCH auth/resend-confirmation-link', () => {
    it('should send a confirmation link', async () => {
      const user = await setupUser();
      await request(app.getHttpServer())
        .patch(`${URL}/resend-confirmation-link`)
        .set('content-type', 'application/json')
        .query({ login: user.login })
        .expect(HttpStatus.OK)
        .expect((response: request.Response) => {
          expect(response.body.message).toBeDefined();
        });
    });
  });

  describe('/GET auth/activate/:verificationCode', () => {
    it('should activate an user account with valid verification code', async () => {
      const user = await setupUser();
      const key = user.verificationKey;
      await request(app.getHttpServer())
        .get(`${URL}/activate/${key}`)
        .set('accept', '*/*')
        .set('Content-Type', 'application/json')
        .send({ verificationCode: key })
        .expect(HttpStatus.OK)
        .expect((response: request.Response) => {
          expect(response.body.message).toBeDefined();
        });
    });

    it('should not activate when wrong verification code', async () => {
      await setupUser();
      await request(app.getHttpServer()).get(`${URL}/activate/bad`).set('accept', '*/*').set('Content-Type', 'application/json').expect(HttpStatus.UNAUTHORIZED);
    });

    it('should not activate when no user', async () => {
      await request(app.getHttpServer())
        .get(`${URL}/activate/${createUserDTOMock.verificationKey}`)
        .set('accept', '*/*')
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should not activate when already active', async () => {
      const user = await setupActiveUser();
      const key = user.verificationKey;
      await request(app.getHttpServer())
        .get(`${URL}/activate/${key}`)
        .set('accept', '*/*')
        .set('Content-Type', 'application/json')
        .send({ verificationCode: key })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
