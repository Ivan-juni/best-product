import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTableIfNotExists('users', (table) => {
      table.increments()

      table.string('email').notNullable().unique()
      table.bigInteger('phone').unsigned().nullable()
      table.string('password').notNullable()
      table.string('firstName', 255).notNullable()
      table.string('lastName', 255).notNullable()
      table.string('role', 5).defaultTo('USER')

      table.timestamps(true, true, true)
    })
    .createTableIfNotExists('tokens', (table) => {
      table.increments()

      table.text('refreshToken').notNullable()
      table.integer('userId').notNullable().unique()

      table.timestamps(true, true, true)
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('tokens').dropTableIfExists('users')
}
