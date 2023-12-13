import { User } from '../../../users/user.entity';

export const usersServiceMock = {
  findOneById: jest.fn().mockResolvedValue(User),
  updateInfo: jest.fn().mockResolvedValue({ message: 'user data has been successfully changed' }),
  updatePassword: jest.fn().mockResolvedValue({ message: 'password has been successfully changed' }),
  remove: jest.fn().mockResolvedValue({ message: 'user deleted' })
};
