import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTableIfNotExists('products', (table) => {
    table.increments()

    table.string('name', 20).notNullable()
    table.integer('price').notNullable()
    table.string('image').notNullable()
    table
      .integer('categoryId', 5)
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('categories')
    table.integer('likes').defaultTo(0)
    table.integer('dislikes').defaultTo(0)
    table.integer('views').defaultTo(0)
    table.integer('favoriteStars').defaultTo(0)
    table.string('description', 500).notNullable()
    table
      .integer('characteristicsId', 5)
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('product_characteristics')

    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('products')
}
