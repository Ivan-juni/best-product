"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const category_model_1 = __importDefault(require("../category/category.model"));
const product_characteristics_model_1 = __importDefault(require("../product-characteristics/product-characteristics.model"));
class ProductHistory extends objection_1.Model {
    static get tableName() {
        return 'products_history';
    }
    $beforeInsert() {
        this.datetime = new Date();
    }
    static get actionColumn() {
        return 'action';
    }
    static get revisionColumn() {
        return 'revision';
    }
    static get nameColumn() {
        return 'name';
    }
    static get priceColumn() {
        return 'price';
    }
    static get imageColumn() {
        return 'image';
    }
    static get categoryIdColumn() {
        return 'categoryId';
    }
    static get likesColumn() {
        return 'likes';
    }
    static get dislikesColumn() {
        return 'dislikes';
    }
    static get viewsColumn() {
        return 'views';
    }
    static get favoriteStarsColumn() {
        return 'favoriteStars';
    }
    static get characteristicsIdColumn() {
        return 'characteristicsId';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: [
                'name',
                'price',
                'image',
                'categoryId',
                'favoriteStars',
                'characteristicsId',
            ],
            properties: {
                action: { type: 'string' },
                revision: { type: 'integer' },
                id: { type: 'integer' },
                name: { type: 'string', maxLength: 20 },
                price: { type: 'integer' },
                image: { type: 'string' },
                categoryId: { type: 'integer' },
                likes: { type: 'integer', default: 0 },
                dislikes: { type: 'integer', default: 0 },
                views: { type: 'integer', default: 0 },
                favoriteStars: { type: 'integer', default: 0 },
                characteristicsId: { type: 'integer' },
            },
        };
    }
}
exports.default = ProductHistory;
ProductHistory.relationMappings = {
    category: {
        relation: objection_1.Model.HasOneRelation,
        modelClass: category_model_1.default,
        join: {
            from: 'products.categoryId',
            to: 'categories.id',
        },
    },
    characteristics: {
        relation: objection_1.Model.HasOneRelation,
        modelClass: product_characteristics_model_1.default,
        join: {
            from: 'products.characteristicsId',
            to: 'product_characteristics.id',
        },
    },
};
//# sourceMappingURL=product-history.model.js.map