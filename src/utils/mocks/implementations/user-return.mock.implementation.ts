import { User } from '../../../users/entities/user.entity';
import { Address } from '../../../users/entities/address.entity';

export const userMockImplementation = (): User => {
  let user = new User();
  user.address = new Address();
  return user;
};
