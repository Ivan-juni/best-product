import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Inserts seed entries
  await knex('products').insert([
    {
      id: 1,
      name: 'JBL T450',
      price: 800,
      image: 'http://localhost:8000/static/products/JBL_T450/jblt450large-1671010055765.jpeg',
      categoryId: 6,
      characteristicsId: 1,
    },
    {
      id: 2,
      name: 'Samsung Smart TV 40',
      price: 1300,
      image: 'http://localhost:8000/static/products/Samsung_Smart_TV_40/SamsungSmartTV40.png',
      categoryId: 5,
      characteristicsId: 2,
    },
    {
      id: 3,
      name: 'MacBook Pro M2 2022',
      price: 1700,
      image: 'http://localhost:8000/static/products/MacBook_Pro_M2_2022/MacBookProM22022.jpeg',
      categoryId: 3,
      characteristicsId: 3,
    },
    {
      id: 4,
      name: 'Apple Iphone 11',
      price: 600,
      image: 'http://localhost:8000/static/products/Apple_Iphone_11/AppleIphone11.jpeg',
      categoryId: 7,
      characteristicsId: 4,
    },
    {
      id: 5,
      name: 'USB Converter',
      price: 600,
      image: 'http://localhost:8000/static/products/USB_Converter/UsbCarConverter-1670584132912.png',
      categoryId: 8,
      characteristicsId: 5,
    },
  ])
}
