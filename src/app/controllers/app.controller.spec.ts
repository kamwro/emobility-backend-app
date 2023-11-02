import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpCode } from '@nestjs/common';

describe('AppController', () => {
  let appController!: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      imports: [ConfigModule],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });

    it('should redirect to the OpenAPI docs', async () => {
      expect(appController.redirectToDocs).toEqual(HttpCode(401));
    });
  });
});
