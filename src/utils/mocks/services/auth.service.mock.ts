import { CreateUserDTO } from '../../../users/dtos/create-user.dto';

export const authServiceMock = {
  registerUser: jest.fn((dto: CreateUserDTO) => {
    return {
      info: {
        ...dto,
      },
      message: 'activation link has been sent',
    };
  }),
};
