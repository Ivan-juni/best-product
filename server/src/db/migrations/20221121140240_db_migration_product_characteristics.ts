import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTableIfNotExists('product_characteristics', (table) => {
    table.increments()

    table.string('purpose').notNullable()
    table.string('description', 500).notNullable()
    table.string('design').nullable()
    table.string('connectionType').nullable()
    table.boolean('microphone').defaultTo(false)
    table.integer('batteryLiveTime').nullable()
    table.string('display').nullable()

    table.timestamps(true, true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('product_characteristics')
}
