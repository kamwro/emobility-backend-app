import { DataSource } from 'typeorm';
import { MockType } from '../types/mock-type';

export const dataSourceMockFactory: () => MockType<DataSource> = jest.fn(() => ({
  createQueryRunner: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    release: jest.fn(),
    rollbackTransaction: jest.fn(),
    manager: {
      save: jest.fn(),
      remove: jest.fn(),
    },
  })),
}));
