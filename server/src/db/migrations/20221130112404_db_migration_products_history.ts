import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    'CREATE TABLE IF NOT EXISTS `products_history` LIKE `products`'
  )

  await knex.raw(`ALTER TABLE \`products_history\` MODIFY COLUMN \`id\` int(11) NOT NULL, 
      DROP PRIMARY KEY, ENGINE = MyISAM, ADD \`action\` VARCHAR(8) DEFAULT "insert" FIRST, 
      ADD \`revision\` INT(6) NOT NULL AUTO_INCREMENT AFTER \`action\`,
      ADD \`datetime\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER \`revision\`,
      ADD PRIMARY KEY (\`id\`, \`revision\`);`)

  await knex.raw('DROP TRIGGER IF EXISTS `products__ai`;')
  await knex.raw('DROP TRIGGER IF EXISTS `products__au`;')
  await knex.raw('DROP TRIGGER IF EXISTS `products__bd`;')

  await knex.raw(`CREATE TRIGGER \`products__ai\` AFTER INSERT ON \`products\` FOR EACH ROW
          INSERT INTO \`products_history\` SELECT 'insert', NULL, NOW(), products.* 
          FROM \`products\` WHERE products.id = NEW.id;`)

  await knex.raw(`CREATE TRIGGER \`products__au\` AFTER UPDATE ON \`products\` FOR EACH ROW
          INSERT INTO \`products_history\` SELECT 'update', NULL, NOW(), products.*
          FROM \`products\` WHERE products.id = NEW.id;`)

  await knex.raw(`CREATE TRIGGER \`products__bd\` BEFORE DELETE ON \`products\` FOR EACH ROW
          INSERT INTO \`products_history\` SELECT 'delete', NULL, NOW(), products.* 
          FROM \`products\` WHERE products.id = OLD.id;`)
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('products_history')
    .dropTableIfExists('favorites')
    .dropTableIfExists('comments')
    .dropTableIfExists('products')
    .dropTableIfExists('product_characteristics')
    .dropTableIfExists('categories')
    .dropTableIfExists('users')
}
