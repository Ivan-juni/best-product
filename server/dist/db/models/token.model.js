"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
class Token extends objection_1.Model {
    static get tableName() {
        return 'tokens';
    }
    $beforeInsert() {
        this.createdAt = new Date();
    }
    $beforeUpdate() {
        this.updatedAt = new Date();
    }
    static get refreshTokenColumn() {
        return 'email';
    }
    static get userIdColumn() {
        return 'phone';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['refreshToken', 'userId'],
            properties: {
                id: { type: 'integer' },
                refreshToken: { type: 'string' },
                userId: { type: 'integer' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
            },
        };
    }
}
exports.default = Token;
//# sourceMappingURL=token.model.js.map