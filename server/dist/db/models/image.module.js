"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
class Image extends objection_1.Model {
    static get tableName() {
        return 'images';
    }
    $beforeInsert() {
        this.createdAt = new Date();
    }
    $beforeUpdate() {
        this.updatedAt = new Date();
    }
    static get productIdColumn() {
        return 'productId';
    }
    static get srcColumn() {
        return 'src';
    }
    static get modifiers() {
        return {
            selectIdAndSrc(builder) {
                builder.select('id', 'src');
            },
        };
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['productId', 'src'],
            properties: {
                id: { type: 'integer' },
                productId: { type: 'integer' },
                src: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
            },
        };
    }
}
exports.default = Image;
//# sourceMappingURL=image.module.js.map