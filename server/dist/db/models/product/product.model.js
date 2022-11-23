"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const category_model_1 = __importDefault(require("../category/category.model"));
const product_characteristics_model_1 = __importDefault(require("../product-characteristics/product-characteristics.model"));
class Product extends objection_1.Model {
    static get tableName() {
        return 'products';
    }
    $beforeInsert() {
        this.createdAt = new Date();
    }
    $beforeUpdate() {
        this.updatedAt = new Date();
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
    static get charasteristicsIdColumn() {
        return 'charasteristicsId';
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
                'charasteristicsId',
            ],
            properties: {
                id: { type: 'integer' },
                name: { type: 'string', maxLength: 20 },
                price: { type: 'integer' },
                image: { type: 'string' },
                categoryId: { type: 'integer', maxLength: 5 },
                likes: { type: 'integer', defalut: 0, min: 0 },
                dislikes: { type: 'integer', defalut: 0 },
                views: { type: 'integer', defalut: 0 },
                favoriteStars: { type: 'integer', defalut: 0 },
                charasteristicsId: { type: 'integer', maxLength: 5 },
            },
        };
    }
}
exports.default = Product;
Product.relationMappings = {
    categories: {
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
//# sourceMappingURL=product.model.js.map