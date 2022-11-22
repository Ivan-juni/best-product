import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTableIfNotExists('favorites', (table) => {
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

    table.timestamps(true, true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('favorites')
    .dropTableIfExists('comments')
    .dropTableIfExists('products')
    .dropTableIfExists('product_characteristics')
    .dropTableIfExists('categories')
    .dropTableIfExists('users')
}
