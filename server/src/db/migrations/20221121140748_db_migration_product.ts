import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const result = knex.schema.createTableIfNotExists('products', (table) => {
    table.increments()

    table.string('name', 40).notNullable().unique()
    table.integer('price').notNullable()
    table.string('image').notNullable()
    table.integer('categoryId', 5).notNullable().unsigned().references('id').inTable('categories')
    table.integer('likes').defaultTo(0).unsigned()
    table.integer('dislikes').defaultTo(0).unsigned()
    table.integer('views').defaultTo(0).unsigned()
    table.integer('favoriteStars').defaultTo(0).unsigned()
    table.integer('characteristicsId', 5).notNullable().unsigned().references('id').inTable('product_characteristics').onDelete('CASCADE')

    table.timestamps(true, true, true)
  })

  return result
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('products')
}
