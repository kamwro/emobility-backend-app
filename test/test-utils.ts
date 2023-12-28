import { createUserDTOMock } from '../src/utils/shared-mocks/create-user.dto.mock';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../src/users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
import { NotFoundException } from '@nestjs/common';

config({ path: `.env` });

const jwtService = new JwtService();

export const dbConfig = { type: 'sqlite', database: ':memory:', entities: [User], synchronize: true, dropSchema: true };

export const setupUser = async (repo: Repository<User>) => {
  const password = createUserDTOMock.password;
  const hashedPassword = await hash(password, 10);
  const verificationKey = await jwtService.signAsync(
    { login: createUserDTOMock.login },
    {
      secret: <string>process.env.VERIFICATION_JWT_SECRET,
    },
  );
  const user = repo.create({ ...createUserDTOMock, password: hashedPassword, verificationKey: verificationKey });
  return await repo.save(user);
};

export const setupActiveUser = async (repo: Repository<User>) => {
  let user = await repo.findOne({ where: { login: createUserDTOMock.login } });
  if (!user) {
    throw new NotFoundException();
  }
  user.isActive = true;
  return await repo.save(user);
};
