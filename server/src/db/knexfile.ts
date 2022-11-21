import type { Knex } from 'knex'
import dotenv from 'dotenv'

dotenv.config()

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      // database: process.env.DB_NAME,
      // host: 'localhost',
      // user: process.env.DB_USER,
      // password: process.env.DB_PASSWORD,
      database: 'best_product',
      host: 'localhost',
      user: 'root',
      password: 'root',
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
