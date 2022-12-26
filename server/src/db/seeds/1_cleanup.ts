import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del()

  await knex('images').del()

  await knex('products').del()

  await knex('categories').del()

  await knex('product_characteristics').del()

  await knex('products_history').del()
}
