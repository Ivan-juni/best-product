"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
class ProductCharacteristics extends objection_1.Model {
    static get tableName() {
        return 'product_characteristics';
    }
    $beforeInsert() {
        this.createdAt = new Date();
    }
    $beforeUpdate() {
        this.updatedAt = new Date();
    }
    static get purposeColumn() {
        return 'purpose';
    }
    static get descriptionColumn() {
        return 'description';
    }
    static get designColumn() {
        return 'design';
    }
    static get connectionTypeColumn() {
        return 'connectionType';
    }
    static get microphoneColumn() {
        return 'microphone';
    }
    static get batteryLiveTimeColumn() {
        return 'batteryLiveTime';
    }
    static get displayColumn() {
        return 'display';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['purpose', 'description'],
            properties: {
                id: { type: 'integer' },
                purpose: { type: 'string' },
                description: { type: 'string', maxLength: 500 },
                design: { type: ['string', 'null'] },
                connectionType: { type: ['string', 'null'] },
                microphone: { type: 'boolean', default: false },
                batteryLiveTime: { type: ['number', 'null'] },
                display: { type: ['string', 'null'] },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
            },
        };
    }
}
exports.default = ProductCharacteristics;
//# sourceMappingURL=product-characteristics.model.js.map