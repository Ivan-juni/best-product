import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTableIfNotExists('comments', (table) => {
    table.increments()

    table
      .integer('userId', 5)
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table
      .integer('productId', 5)
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('products')
      .onDelete('CASCADE')

    table.string('text', 300).notNullable()

    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('comments')
}
