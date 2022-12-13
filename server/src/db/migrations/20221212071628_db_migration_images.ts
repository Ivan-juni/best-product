import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTableIfNotExists('images', (table) => {
    table.increments()

    table.integer('productId', 5).notNullable().unsigned().references('id').inTable('products').onDelete('CASCADE')
    table.string('src', 255).notNullable()

    table.timestamps(true, true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('images')
    .dropTableIfExists('products_history')
    .dropTableIfExists('favorites')
    .dropTableIfExists('comments')
    .dropTableIfExists('products')
    .dropTableIfExists('product_characteristics')
    .dropTableIfExists('categories')
    .dropTableIfExists('users')
}
