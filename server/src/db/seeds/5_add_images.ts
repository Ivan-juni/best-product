import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('images').del()

  // Inserts seed entries
  await knex('images').insert([
    { productId: 1, src: 'http://localhost:8000/static/products/JBL_T450/jblt450cable.png' },
    { productId: 1, src: 'http://localhost:8000/static/products/JBL_T450/jblt450blue.png' },
  ])
}
