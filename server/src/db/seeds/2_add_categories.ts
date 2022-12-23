import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  // await knex('product_characteristics').del()
  await knex('images').del()
  await knex('products').del()
  await knex('categories').del()

  // Inserts seed entries
  await knex('categories').insert([
    { parent: 0, name: 'Electronics' },
    { parent: 1, name: 'Accessories' },
    { parent: 1, name: 'Laptops' },
    { parent: 1, name: 'Tablets' },
    { parent: 1, name: 'TV' },
    { parent: 2, name: 'Headphones' },
    { parent: 1, name: 'Smartphones' },
    { parent: 2, name: 'Car Accessories' },
  ])
}
