import { Address } from '../../../users/entities/address.entity';

export const addressRepositoryMock = {
  create: jest.fn().mockResolvedValue(Address),
};
