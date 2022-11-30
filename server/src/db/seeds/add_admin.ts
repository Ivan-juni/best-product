import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del()

  // Inserts seed entries
  await knex('users').insert([
    {
      email: 'admin@gmail.com',
      phone: 380994960349,
      password: '$2b$04$AJz/c1BJBnMhckc4vJfv2.r5ZoPKkhTnoMgmNUrPpPY4CLfpHqwV2',
      firstName: 'Admin',
      lastName: 'Admin',
      role: 'ADMIN',
      photo: 'http://localhost:8000/static/users/admin-1669204612771.png',
    },
  ])
}
