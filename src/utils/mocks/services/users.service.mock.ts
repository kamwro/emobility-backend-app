import { CreateUserDTO } from '../../../users/dtos/create-user.dto';
import { User } from '../../../users/entities/user.entity';

export const usersServiceMock = {
  find: jest.fn(() => {
    return {
      user: User 
    };
  }),
  findOneBy: jest.fn(),
  create: jest.fn((dto: CreateUserDTO) => {
    return {
      ...dto,
      id: 1,
    };
  }),
  delete: jest.fn(),
  save: jest.fn(),
};
