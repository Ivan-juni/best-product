"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
class Category extends objection_1.Model {
    static get tableName() {
        return 'categories';
    }
    $beforeInsert() {
        this.createdAt = new Date();
    }
    $beforeUpdate() {
        this.updatedAt = new Date();
    }
    static get parentColumn() {
        return 'parent';
    }
    static get nameColumn() {
        return 'name';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['parent', 'name'],
            properties: {
                id: { type: 'integer' },
                parent: { type: 'integer', maxLength: 5 },
                name: { type: 'integer', maxLength: 20 },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
            },
        };
    }
}
exports.default = Category;
//# sourceMappingURL=category.model.js.map