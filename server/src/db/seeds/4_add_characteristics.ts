import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Inserts seed entries
  await knex('product_characteristics').insert([
    {
      id: 1,
      purpose: 'Listening music',
      description: "It's description for Headphones JBL T110",
      design: 'overhead, closed',
      connectionType: 'combined, 3.5 mm, Bluetooth v 5.0',
      microphone: true,
      batteryLiveTime: 12,
    },
    {
      id: 2,
      purpose: 'Relax, intertaiment',
      description: 'It\'s description for Samsung Smart TV 40"',
      design: 'flat',
      connectionType: '220v cable, wireless, Bluetooth v 5.0',
      display: '40 inch, amoled',
    },
    {
      id: 3,
      purpose: 'Work',
      description: "It's description for MacBook Pro M2 2022",
      design: 'space grey corps',
      connectionType: '220v cable, wireless, Bluetooth v 5.0',
      microphone: true,
      batteryLiveTime: 20,
      display: '14 inch, retina',
    },
    {
      id: 4,
      purpose: 'For smartphone',
      description: "It's description for Apple Iphone 11",
      design: 'PRODUCT RED',
      connectionType: 'usb lightning, wireless, Bluetooth v 5.0',
      microphone: true,
      batteryLiveTime: 30,
      display: '5.7 inch, retina',
    },
    {
      id: 5,
      purpose: 'For auto',
      description: "It's description for USB converter",
      connectionType: '12v to usb 3.0',
    },
  ])
}
