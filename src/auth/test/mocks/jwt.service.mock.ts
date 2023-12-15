import { tokenMock } from '../../../utils/shared-mocks/token.mock';

export const jwtServiceMock = {
  signAsync: jest.fn().mockResolvedValue(tokenMock),
  verifyAsync: jest.fn(),
};
