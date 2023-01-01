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
        return knex.schema.createTableIfNotExists('product_characteristics', (table) => {
            table.increments('id').references('characteristicsId').inTable('products').onDelete('CASCADE');
            table.string('purpose').notNullable();
            table.string('description', 500).notNullable();
            table.string('design').nullable();
            table.string('connectionType').nullable();
            table.boolean('microphone').defaultTo(false);
            table.integer('batteryLiveTime').nullable();
            table.string('display').nullable();
            table.timestamps(true, true, true);
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.dropTableIfExists('product_characteristics');
    });
}
exports.down = down;
//# sourceMappingURL=20221121140240_db_migration_product_characteristics.js.map