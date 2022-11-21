"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
class Favorite extends objection_1.Model {
    static get tableName() {
        return 'favorites';
    }
    $beforeInsert() {
        this.createdAt = new Date();
    }
    $beforeUpdate() {
        this.updatedAt = new Date();
    }
    static get userIdColumn() {
        return 'userId';
    }
    static get productIdColumn() {
        return 'productId';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['userId', 'productId'],
            properties: {
                id: { type: 'integer' },
                userId: { type: 'integer', maxLength: 5 },
                productId: { type: 'integer', maxLength: 5 },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
            },
        };
    }
}
exports.default = Favorite;
//# sourceMappingURL=favorite.model.js.map