import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('products').del()

  // Inserts seed entries
  await knex('products').insert([
    {
      name: 'JBL T110',
      price: 800,
      image: '../static/jblt110.png',
      categoryId: 6,
      characteristicsId: 1,
    }, //!type correct image path
    {
      name: 'Samsung Smart TV 40',
      price: 1300,
      image: '../static/SamsungSmartTV40.png',
      categoryId: 5,
      characteristicsId: 2,
    },
    {
      name: 'MacBook Pro M2 2022',
      price: 1700,
      image: '../static/MacBookProM22022.png',
      categoryId: 3,
      characteristicsId: 3,
    },
    {
      name: 'Apple Iphone 11',
      price: 600,
      image: '../static/AppleIphone11.png',
      categoryId: 7,
      characteristicsId: 4,
    },
    {
      name: 'USB Converter',
      price: 600,
      image: '../static/USBConverter.png',
      categoryId: 8,
      characteristicsId: 5,
    },
  ])
}
