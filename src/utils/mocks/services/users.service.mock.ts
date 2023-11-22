import { userMockImplementation } from '../implementations/user-return.mock.implementation';
import { userArrayMockImplementation } from '../implementations/user-array-return.mock.implementation';

export const usersServiceMock = {
  findAll: jest.fn().mockImplementation(userArrayMockImplementation),
  findOneById: jest.fn().mockImplementation(userMockImplementation),
  findOneByLogin: jest.fn().mockImplementation(userMockImplementation),
  create: jest.fn().mockImplementation(userMockImplementation),
  remove: jest.fn().mockResolvedValue({ message: 'user deleted' }),
  updateRefreshToken: jest.fn().mockResolvedValue({ message: 'refreshed token has been updated' }),
  updateVerificationKey: jest.fn().mockResolvedValue({ message: 'new verification key has been attached' }),
  activate: jest.fn().mockResolvedValue({ message: 'user account activated' }),
};
