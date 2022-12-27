import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Inserts seed entries
  await knex('images').insert([
    { productId: 1, src: 'http://localhost:8000/static/products/JBL_T450/jbl_t450_white-1671010577802.jpeg' },
    { productId: 1, src: 'http://localhost:8000/static/products/JBL_T450/jblt450blue.jpeg' },
    { productId: 1, src: 'http://localhost:8000/static/products/JBL_T450/jblt450blue.jpeg' },
  ])
}
