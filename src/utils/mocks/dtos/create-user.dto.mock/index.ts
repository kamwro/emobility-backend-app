import { createAuthDTOMock } from '../create-auth.dto.mock';

export const createUserDTOMock = {
  firstName: 'test',
  lastName: 'test',
  address: 'test',
  birthday: '2000-01-01',
  login: createAuthDTOMock.login,
  password: createAuthDTOMock.password,
};
