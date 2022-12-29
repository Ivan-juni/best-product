"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const category_model_1 = __importDefault(require("./category.model"));
const favorite_model_1 = __importDefault(require("./favorite.model"));
const comment_model_1 = __importDefault(require("./comment.model"));
const image_module_1 = __importDefault(require("./image.module"));
const product_characteristics_model_1 = __importDefault(require("./product-characteristics.model"));
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
    static get characteristicsIdColumn() {
        return 'characteristicsId';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name', 'price', 'image', 'categoryId', 'favoriteStars', 'characteristicsId'],
            properties: {
                id: { type: 'integer' },
                name: { type: 'string', maxLength: 40 },
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
exports.default = Product;
Product.relationMappings = {
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
    images: {
        relation: objection_1.Model.HasManyRelation,
        modelClass: image_module_1.default,
        join: {
            from: 'products.id',
            to: 'images.productId',
        },
    },
    favorites: {
        relation: objection_1.Model.ManyToManyRelation,
        modelClass: favorite_model_1.default,
        join: {
            from: 'products.id',
            through: {
                from: 'favorites.productId',
                to: 'favorites.userId',
            },
            to: 'users.id',
        },
    },
    comments: {
        relation: objection_1.Model.ManyToManyRelation,
        modelClass: comment_model_1.default,
        join: {
            from: 'products.id',
            through: {
                from: 'comments.productId',
                to: 'comments.userId',
            },
            to: 'users.id',
        },
    },
};
//# sourceMappingURL=product.model.js.map