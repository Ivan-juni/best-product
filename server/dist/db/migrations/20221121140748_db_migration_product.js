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
        const result = knex.schema.createTableIfNotExists('products', (table) => {
            table.increments();
            table.string('name', 40).notNullable().unique();
            table.integer('price').notNullable();
            table.string('image').notNullable();
            table.integer('categoryId', 5).notNullable().unsigned().references('id').inTable('categories');
            table.integer('likes').defaultTo(0).unsigned();
            table.integer('dislikes').defaultTo(0).unsigned();
            table.integer('views').defaultTo(0).unsigned();
            table.integer('favoriteStars').defaultTo(0).unsigned();
            table.integer('characteristicsId', 5).notNullable().unique().unsigned().references('id').inTable('product_characteristics').onDelete('CASCADE');
            table.timestamps(true, true, true);
        });
        return result;
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.dropTableIfExists('products');
    });
}
exports.down = down;
//# sourceMappingURL=20221121140748_db_migration_product.js.map