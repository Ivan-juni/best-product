"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
class Comment extends objection_1.Model {
    static get tableName() {
        return 'comments';
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
    static get textColumn() {
        return 'text';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['userId', 'productId', 'text'],
            properties: {
                id: { type: 'integer' },
                userId: { type: 'integer' },
                productId: { type: 'integer' },
                text: { type: 'string', minLength: 1, maxLength: 300 },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
            },
        };
    }
}
exports.default = Comment;
//# sourceMappingURL=comment.model.js.map