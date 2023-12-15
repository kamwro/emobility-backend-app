import { User } from '../../../users/user.entity';

export const usersServiceMock = {
  findAll: jest.fn().mockResolvedValue([User]),
  findOneById: jest.fn().mockResolvedValue(User),
  findOneByLogin: jest.fn().mockResolvedValue(User),
  create: jest.fn().mockResolvedValue(User),
  remove: jest.fn().mockResolvedValue({ message: 'user deleted' }),
  updateRefreshToken: jest.fn().mockResolvedValue({ message: 'refreshed token has been updated' }),
  updateVerificationKey: jest.fn().mockResolvedValue({ message: 'new verification key has been attached' }),
  activate: jest.fn().mockResolvedValue({ message: 'user account activated' }),
};
