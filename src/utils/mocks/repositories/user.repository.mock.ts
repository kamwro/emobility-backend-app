import { User } from '../../../users/user.entity';

export const userRepositoryMock = {
  find: jest.fn().mockResolvedValue([User]),
  findOneBy: jest.fn().mockResolvedValue(User),
  create: jest.fn().mockResolvedValue(User),
  save: jest.fn().mockResolvedValue(User),
  delete: jest.fn(),
};
