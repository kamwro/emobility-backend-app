import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';

describe('AppController', () => {
  let appController!: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      imports: [ConfigModule],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('AppController (root)', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });
  });
});
