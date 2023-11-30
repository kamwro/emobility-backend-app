import { tokenMock } from '../tokens/token.mock';

export const jwtServiceMock = {
  signAsync: jest.fn().mockResolvedValue(tokenMock),
  verifyAsync: jest.fn(),
};
