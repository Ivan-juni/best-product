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
class FavoritesController {
    static addToFavorite(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            const { productId } = req.query;
            if (!productId) {
                return next(ApiError_1.default.internal('Type product id'));
            }
            if (!id) {
                return next(ApiError_1.default.unAuthorizedError());
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
            if (!id) {
                return next(ApiError_1.default.unAuthorizedError());
            }
            const result = yield favorites_service_1.default.deleteFromFavorite(+id, +productId);
            if (!result) {
                return next(ApiError_1.default.badRequest(`Adding to favorites error`));
            }
            if (typeof result == 'number') {
                return res.json({
                    message: `Successfully deleted ${result} queries`,
                });
            }
            else {
                return res.json(result);
            }
        });
    }
    static getUserFavorites(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            if (!id) {
                return next(ApiError_1.default.unAuthorizedError());
            }
            const favorites = yield favorites_service_1.default.getFavorites(+id);
            if (!favorites) {
                return next(ApiError_1.default.badRequest(`Fetching favorites error`));
            }
            return res.json(favorites);
        });
    }
}
exports.default = FavoritesController;
//# sourceMappingURL=favorites.controller.js.map