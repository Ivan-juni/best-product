import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTableIfNotExists('categories', (table) => {
    table.increments()

    table.integer('parent', 5).notNullable()
    table.string('name', 20).notNullable()

    table.timestamps(true, true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('categories')
}
