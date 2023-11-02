import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
// import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

// const moduleMocker = new ModuleMocker(global);

describe('AuthController', () => {
  let appController!: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [ConfigModule],
    }).compile();

    appController = app.get<AuthController>(AuthController);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });
  });
});
