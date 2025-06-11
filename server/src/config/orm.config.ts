import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

const ENV = process.env.NODE_ENV;

config({ path: `.env.${ENV}` });

const dbConfig: DataSourceOptions = {
  type: 'sqlite',
  database: 'check-in.sqlite',
  synchronize: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: process.env.MIGRATIONS_TABLE_NAME,
  logging: ENV === 'development',
  migrationsRun: ENV === 'production',
};

const dataSource = new DataSource(dbConfig);
export default dataSource;
