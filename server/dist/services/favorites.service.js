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
const favorite_model_1 = __importDefault(require("../db/models/favorite/favorite.model"));
const product_model_1 = __importDefault(require("../db/models/product/product.model"));
const find_products_util_1 = require("../utils/find-products.util");
const sort_by_util_1 = require("../utils/sort-by.util");
class FavoritesService {
    static getFavorites(userId, searchCriteria) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // пагинация
                const limit = +searchCriteria.limit || 5;
                const page = +searchCriteria.page || 0;
                // параметры для сортировки
                const sortParams = (0, sort_by_util_1.sort)(searchCriteria, ['price', 'favoriteStars']);
                const favorites = yield favorite_model_1.default.query()
                    .select('favorites.id as favoritesId', 'products.*', 'favorites.createdAt as timeAdded')
                    .where((qb) => {
                    qb.where({ userId });
                    // id, name, purpose, display, connectionType, microphone, price, views, likes, dislikes, favoriteStars
                    (0, find_products_util_1.findProducts)(qb, searchCriteria);
                })
                    .leftJoin('products', function () {
                    this.on('products.id', '=', 'favorites.productId');
                })
                    .leftJoin('product_characteristics', function () {
                    this.on('product_characteristics.id', '=', 'products.characteristicsId');
                })
                    .orderBy(`products.${sortParams.column}`, sortParams.order)
                    .page(page, limit);
                return favorites;
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
    static addToFavorite(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const favorite = yield favorite_model_1.default.query().findOne({ userId, productId });
                if (favorite) {
                    return favorite;
                }
                // add to favorite and increment 'favorites' option in Product model
                yield product_model_1.default.query()
                    .patch({ favoriteStars: (0, objection_1.raw)('favoriteStars + 1') })
                    .where({ id: productId });
                const userFavorites = yield favorite_model_1.default.query().insertAndFetch({
                    userId,
                    productId,
                });
                return userFavorites;
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
    static deleteFromFavorite(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const favorite = yield favorite_model_1.default.query().findOne({ userId, productId });
                if (!favorite) {
                    return { message: "This product isn't on your favorites" };
                }
                // delete from favorite and decrement 'favorites' option in Product model
                yield product_model_1.default.query()
                    .patch({ favoriteStars: (0, objection_1.raw)('favoriteStars - 1') })
                    .where({ id: productId });
                const deletedQueries = yield favorite_model_1.default.query()
                    .delete()
                    .where({ userId, productId });
                return deletedQueries;
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
}
exports.default = FavoritesService;
//# sourceMappingURL=favorites.service.js.map