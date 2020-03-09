// TODO: this should return a generic connection object based on environment
// variables if this every ends up on a production server.

export const developmentConfig =  {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'fitness-tracker',
  password: 'password',
  database: 'fitness-tracker',
  synchronize: true,
  logging: true,
  entities: [
    'src/entity/**/*.ts'
  ],
  migrations: [
    'src/migration/**/*.ts'
  ],
  subscribers: [
    'src/subscriber/**/*.ts'
  ],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber'
  }
}