"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex.raw('CREATE TABLE IF NOT EXISTS `products_history` LIKE `products`');
        yield knex.raw(`ALTER TABLE \`products_history\` MODIFY COLUMN \`id\` int(11) NOT NULL, 
      DROP PRIMARY KEY, ENGINE = MyISAM, ADD \`action\` VARCHAR(8) DEFAULT "insert" FIRST, 
      ADD \`revision\` INT(6) NOT NULL AUTO_INCREMENT AFTER \`action\`,
      ADD \`datetime\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER \`revision\`,
      ADD PRIMARY KEY (\`id\`, \`revision\`);`);
        yield knex.raw('DROP TRIGGER IF EXISTS `products__ai`;');
        yield knex.raw('DROP TRIGGER IF EXISTS `products__au`;');
        yield knex.raw('DROP TRIGGER IF EXISTS `products__bd`;');
        yield knex.raw(`CREATE TRIGGER \`products__ai\` AFTER INSERT ON \`products\` FOR EACH ROW
          INSERT INTO \`products_history\` SELECT 'insert', NULL, NOW(), products.* 
          FROM \`products\` WHERE products.id = NEW.id;`);
        yield knex.raw(`CREATE TRIGGER \`products__au\` AFTER UPDATE ON \`products\` FOR EACH ROW
          INSERT INTO \`products_history\` SELECT 'update', NULL, NOW(), products.*
          FROM \`products\` WHERE products.id = NEW.id;`);
        yield knex.raw(`CREATE TRIGGER \`products__bd\` BEFORE DELETE ON \`products\` FOR EACH ROW
          INSERT INTO \`products_history\` SELECT 'delete', NULL, NOW(), products.* 
          FROM \`products\` WHERE products.id = OLD.id;`);
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema
            .dropTableIfExists('products_history')
            .dropTableIfExists('favorites')
            .dropTableIfExists('comments')
            .dropTableIfExists('products')
            .dropTableIfExists('product_characteristics')
            .dropTableIfExists('categories')
            .dropTableIfExists('users');
    });
}
exports.down = down;
//# sourceMappingURL=20221130112404_db_migration_products_history.js.map