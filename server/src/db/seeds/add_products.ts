import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('products').del()

  // Inserts seed entries
  await knex('products').insert([
    {
      name: 'JBL T110',
      price: 800,
      image: 'http://localhost:8000/static/products/jblt110.png',
      categoryId: 6,
      characteristicsId: 1,
    },
    {
      name: 'Samsung Smart TV 40',
      price: 1300,
      image: 'http://localhost:8000/static/products/SamsungSmartTV40.png',
      categoryId: 5,
      characteristicsId: 2,
    },
    {
      name: 'MacBook Pro M2 2022',
      price: 1700,
      image: 'http://localhost:8000/static/products/MacBookProM22022.jpeg',
      categoryId: 3,
      characteristicsId: 3,
    },
    {
      name: 'Apple Iphone 11',
      price: 600,
      image: 'http://localhost:8000/static/products/AppleIphone11.jpeg',
      categoryId: 7,
      characteristicsId: 4,
    },
    {
      name: 'USB Converter',
      price: 600,
      image: 'http://localhost:8000/static/products/USBConverter.jpeg',
      categoryId: 8,
      characteristicsId: 5,
    },
  ])
}
