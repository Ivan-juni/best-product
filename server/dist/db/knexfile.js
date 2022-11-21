"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    development: {
        client: 'mysql2',
        connection: {
            // database: process.env.DB_NAME,
            // host: 'localhost',
            // user: process.env.DB_USER,
            // password: process.env.DB_PASSWORD,
            database: 'best_product',
            host: 'localhost',
            user: 'root',
            password: 'root',
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
        },
        seeds: {
            directory: './seeds',
        },
    },
};
exports.default = config;
//# sourceMappingURL=knexfile.js.map