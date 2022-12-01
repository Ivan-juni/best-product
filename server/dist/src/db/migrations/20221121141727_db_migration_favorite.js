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
        return knex.schema.createTableIfNotExists('favorites', (table) => {
            table.increments();
            table
                .integer('userId', 5)
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');
            table
                .integer('productId', 5)
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('products')
                .onDelete('CASCADE');
            table.timestamps(true, true, true);
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema
            .dropTableIfExists('favorites')
            .dropTableIfExists('comments')
            .dropTableIfExists('products')
            .dropTableIfExists('product_characteristics')
            .dropTableIfExists('categories')
            .dropTableIfExists('users');
    });
}
exports.down = down;
//# sourceMappingURL=20221121141727_db_migration_favorite.js.map