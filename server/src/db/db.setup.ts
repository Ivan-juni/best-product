import knex from 'knex'
import knexfile from './knexfile'
import { Model } from 'objection'

function setupDb(): void {
  const db = knex(knexfile.development)

  Model.knex(db)
}

export default setupDb
