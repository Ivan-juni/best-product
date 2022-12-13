import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('categories').del()

  // Inserts seed entries
  await knex('categories').insert([
    { id: 1, parent: 0, name: 'Electronics' },
    { id: 2, parent: 1, name: 'Accessories' },
    { id: 3, parent: 1, name: 'Laptops' },
    { id: 4, parent: 1, name: 'Tablets' },
    { id: 5, parent: 1, name: 'TV' },
    { id: 6, parent: 2, name: 'Headphones' },
    { id: 7, parent: 1, name: 'Smartphones' },
    { id: 8, parent: 2, name: 'Car Accessories' },
  ])
}
