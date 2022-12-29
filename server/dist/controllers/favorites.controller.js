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
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const favorites_service_1 = __importDefault(require("../services/favorites.service"));
const favorite_model_1 = __importDefault(require("../db/models/favorite.model"));
const product_model_1 = __importDefault(require("../db/models/product.model"));
class FavoritesController {
    static getUserFavorites(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            const favorites = yield favorites_service_1.default.getFavorites(+id, req.query);
            if (!favorites) {
                return next(ApiError_1.default.badRequest(`Fetching favorites error`));
            }
            return res.json(favorites);
        });
    }
    static getUserFavoritesIds(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            const ids = yield favorites_service_1.default.getIds(+id);
            if (!ids) {
                return next(ApiError_1.default.badRequest(`Fetching favorites ids error`));
            }
            return res.json(ids);
        });
    }
    static addToFavorite(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            const { productId } = req.query;
            if (!productId) {
                return next(ApiError_1.default.internal('Type product id'));
            }
            const favorite = yield favorite_model_1.default.query().findOne({ userId: id, productId: +productId });
            if (favorite) {
                return next(ApiError_1.default.internal('This product already in on your favorites'));
            }
            const favorites = yield favorites_service_1.default.addToFavorite(+id, +productId);
            if (!favorites) {
                return next(ApiError_1.default.badRequest(`Adding to favorites error`));
            }
            return res.json(favorites);
        });
    }
    static deleteFromFavorite(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            const { productId } = req.query;
            if (!productId) {
                return next(ApiError_1.default.internal('Type product id'));
            }
            const favorite = yield favorite_model_1.default.query().findOne({ userId: id, productId: +productId });
            if (!favorite) {
                return next(ApiError_1.default.internal("This product isn't on your favorites"));
            }
            const result = yield favorites_service_1.default.deleteFromFavorite(+id, +productId);
            if (!result) {
                return next(ApiError_1.default.badRequest(`Adding to favorites error`));
            }
            else {
                return res.json({
                    message: `Successfully deleted ${result} queries`,
                });
            }
        });
    }
    // likes / dislikes / views
    static addLike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.query;
            if (!productId) {
                return next(ApiError_1.default.internal('Type product id'));
            }
            else {
                const product = yield product_model_1.default.query().findOne({ id: +productId });
                if (!product) {
                    return next(ApiError_1.default.internal("Can't find this product"));
                }
            }
            const likes = yield favorites_service_1.default.addLike(+productId);
            if (!likes) {
                return next(ApiError_1.default.badRequest(`Adding like error`));
            }
            if (likes === 1) {
                return res.json({ message: 'Like successfully added' });
            }
            else {
                return res.json({ message: 'Like has not added' });
            }
        });
    }
    static deleteLike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.query;
            if (!productId) {
                return next(ApiError_1.default.internal('Type product id'));
            }
            else {
                const product = yield product_model_1.default.query().findOne({ id: +productId });
                if (!product) {
                    return next(ApiError_1.default.internal("Can't find this product"));
                }
                if (product.likes === 0) {
                    return next(ApiError_1.default.internal("Can't decrement like, because it's 0 likes"));
                }
            }
            const likes = yield favorites_service_1.default.deleteLike(+productId);
            if (!likes) {
                return next(ApiError_1.default.badRequest(`Deletion like error`));
            }
            if (likes === 1) {
                return res.json({ message: 'Like successfully deleted' });
            }
            else {
                return res.json({ message: 'Like has not deleted' });
            }
        });
    }
    static addDislike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.query;
            if (!productId) {
                return next(ApiError_1.default.internal('Type product id'));
            }
            else {
                const product = yield product_model_1.default.query().findOne({ id: +productId });
                if (!product) {
                    return next(ApiError_1.default.internal("Can't find this product"));
                }
                if (product.dislikes === 0) {
                    return next(ApiError_1.default.internal("Can't decrement dislike, because it's = 0"));
                }
            }
            const dislikes = yield favorites_service_1.default.addDislike(+productId);
            if (!dislikes) {
                return next(ApiError_1.default.badRequest(`Adding dislike error`));
            }
            if (dislikes === 1) {
                return res.json({ message: 'Dislike successfully added' });
            }
            else {
                return res.json({ message: 'Dislike has not added' });
            }
        });
    }
    static deleteDislike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.query;
            if (!productId) {
                return next(ApiError_1.default.internal('Please, type product id'));
            }
            else {
                const product = yield product_model_1.default.query().findOne({ id: +productId });
                if (!product) {
                    return next(ApiError_1.default.internal("Can't find this product"));
                }
            }
            const dislikes = yield favorites_service_1.default.deleteDislike(+productId);
            if (!dislikes) {
                return next(ApiError_1.default.badRequest(`Deletion dislike error`));
            }
            if (dislikes === 1) {
                return res.json({ message: 'Dislike successfully deleted' });
            }
            else {
                return res.json({ message: 'Dislike has not deleted' });
            }
        });
    }
    static addView(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.query;
            if (!productId) {
                return next(ApiError_1.default.internal('Type product id'));
            }
            else {
                const product = yield product_model_1.default.query().findOne({ id: +productId });
                if (!product) {
                    return next(ApiError_1.default.internal("Can't find this product"));
                }
            }
            const views = yield favorites_service_1.default.addView(+productId);
            if (!views) {
                return next(ApiError_1.default.badRequest(`Adding view error`));
            }
            if (views === 1) {
                return res.json({ message: 'View successfully added' });
            }
            else {
                return res.json({ message: 'View has not added' });
            }
        });
    }
}
exports.default = FavoritesController;
//# sourceMappingURL=favorites.controller.js.map