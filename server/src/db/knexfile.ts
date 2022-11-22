import type { Knex } from 'knex'
import * as dotenv from 'dotenv'

dotenv.config()

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
}

export default config
