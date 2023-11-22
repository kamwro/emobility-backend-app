import { userMockImplementation } from "../implementations/user-return.mock.implementation";
import { userArrayMockImplementation } from "../implementations/user-array-return.mock.implementation";

export const userRepositoryMock = {
  find: jest.fn().mockImplementation(userArrayMockImplementation),
  findOne: jest.fn().mockImplementation(userMockImplementation),
  findOneBy: jest.fn().mockImplementation(userMockImplementation),
  create: jest.fn().mockImplementation(userMockImplementation),
  save: jest.fn().mockImplementation(userMockImplementation),
  delete: jest.fn(),
};