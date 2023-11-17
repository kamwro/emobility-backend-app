import { User } from '../../users/entities/user.entity';
import { Tokens } from './tokens.type';

export type UserInfo = {
  entity: User;
  tokens: Tokens;
};
