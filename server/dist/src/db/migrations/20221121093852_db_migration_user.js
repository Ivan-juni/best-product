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
        return knex.schema
            .createTableIfNotExists('users', (table) => {
            table.increments();
            table.string('email').notNullable().unique();
            table.bigInteger('phone').unsigned().nullable();
            table.string('password').notNullable();
            table.string('firstName', 255).notNullable();
            table.string('lastName', 255).notNullable();
            table.string('role', 5).defaultTo('USER');
            table.string('photo', 255).nullable().defaultTo(null);
            table.timestamps(true, true, true);
        })
            .createTableIfNotExists('tokens', (table) => {
            table.increments();
            table.text('refreshToken').notNullable();
            table.integer('userId').notNullable().unique();
            table.timestamps(true, true, true);
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.dropTableIfExists('tokens').dropTableIfExists('users');
    });
}
exports.down = down;
//# sourceMappingURL=20221121093852_db_migration_user.js.map