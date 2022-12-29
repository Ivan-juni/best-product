"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const favorite_model_1 = __importDefault(require("../db/models/favorite.model"));
const product_model_1 = __importDefault(require("../db/models/product.model"));
const find_products_util_1 = require("../utils/find-products.util");
const order_by_util_1 = require("../utils/order-by.util");
class FavoritesService {
    static getFavorites(userId, searchCriteria) {
        return __awaiter(this, void 0, void 0, function* () {
            // пагинация
            const limit = +searchCriteria.limit || 5;
            const page = +searchCriteria.page || 0;
            // параметры для сортировки
            const sortParams = (0, order_by_util_1.sort)(searchCriteria, ['price', 'favoriteStars']);
            sortParams.map((param) => {
                param.column = `products.${param.column}`;
            });
            return product_model_1.default.query()
                .select('favorites.id as favoritesId', 'products.id', 'products.name', 'products.price', 'products.image', 'products.likes', 'products.dislikes', 'products.views', 'products.favoriteStars', 'products.createdAt', 'products.updatedAt', 'favorites.createdAt as timeAdded')
                .where((qb) => {
                qb.where('favorites.userId', '=', `${userId}`);
                // id, name, purpose, display, connectionType, microphone, price, views, likes, dislikes, favoriteStars
                (0, find_products_util_1.findProducts)(qb, searchCriteria);
            })
                .leftJoin('favorites', function () {
                this.on('favorites.productId', '=', 'products.id');
            })
                .leftJoin('product_characteristics', function () {
                this.on('product_characteristics.id', '=', 'products.characteristicsId');
            })
                .withGraphFetched('[category(selectNameIdParent), characteristics, images(selectIdAndSrc)]')
                .orderBy(sortParams)
                .page(page, limit);
        });
    }
    static getIds(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return favorite_model_1.default.query().select((0, objection_1.raw)('GROUP_CONCAT( productId SEPARATOR "," ) as ids')).where({
                userId,
            });
        });
    }
    static addToFavorite(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            // add to favorite and increment 'favorites' option in Product model
            yield product_model_1.default.query()
                .patch({ favoriteStars: (0, objection_1.raw)('favoriteStars + 1') })
                .where({ id: productId });
            return favorite_model_1.default.query().insertAndFetch({
                userId,
                productId,
            });
        });
    }
    static deleteFromFavorite(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            // delete from favorite and decrement 'favorites' option in Product model
            yield product_model_1.default.query()
                .patch({ favoriteStars: (0, objection_1.raw)('favoriteStars - 1') })
                .where({ id: productId });
            return favorite_model_1.default.query().delete().where({ userId, productId });
        });
    }
    // likes / dislikes
    static deleteLike(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            // decrement 'likes' option in Product model
            return product_model_1.default.query()
                .patch({ likes: (0, objection_1.raw)('likes - 1') })
                .where({ id: productId });
        });
    }
    static addLike(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            // increment 'likes' option in Product model
            return product_model_1.default.query()
                .patch({ likes: (0, objection_1.raw)('likes + 1') })
                .where({ id: productId });
        });
    }
    static deleteDislike(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            // decrement 'dislikes' option in Product model
            return product_model_1.default.query()
                .patch({ dislikes: (0, objection_1.raw)('dislikes - 1') })
                .where({ id: productId });
        });
    }
    static addDislike(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            // increment 'dislikes' option in Product model
            return product_model_1.default.query()
                .patch({ dislikes: (0, objection_1.raw)('dislikes + 1') })
                .where({ id: productId });
        });
    }
    static addView(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            // increment 'views' option in Product model
            return product_model_1.default.query()
                .patch({ views: (0, objection_1.raw)('views + 1') })
                .where({ id: productId });
        });
    }
}
exports.default = FavoritesService;
//# sourceMappingURL=favorites.service.js.map