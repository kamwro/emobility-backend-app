import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './users/user.entity';
import { ChargingStation } from './charging-stations/entities/charging-station.entity';
import { ChargingStationType } from './charging-stations/entities/station-type.entity';

config({ path: `.env` });

const typeormConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: parseInt(<string>process.env.POSTGRES_DBEAVER_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_NAME,
  entities: [User, ChargingStation, ChargingStationType],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
};

export default new DataSource(typeormConfig);
