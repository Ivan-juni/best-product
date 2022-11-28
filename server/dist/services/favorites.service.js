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
class FavoritesService {
    static getFavorites(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const favorites = yield favorite_model_1.default.query()
                    .select('favorites.id', 'products.*', 'favorites.createdAt', 'favorites.updatedAt')
                    .where({ userId })
                    .leftJoin('products', function () {
                    this.on('products.id', '=', 'favorites.productId');
                });
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
                const candidate = yield favorite_model_1.default.query().findOne({ userId, productId });
                if (candidate) {
                    return candidate;
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