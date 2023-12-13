import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './users/user.entity';

config({ path: `.env` });

const typeormConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: parseInt(<string>process.env.POSTGRES_DBEAVER_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_NAME,
  entities: [User],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
};

export default new DataSource(typeormConfig);
