"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const favorites_controller_1 = __importDefault(require("../controllers/favorites.controller"));
const router = (0, express_1.default)();
// @route get /api/users/favorites?id= ?price= ?orderByPrice=
// @des Get user's favorites
router.get('/', auth_middleware_1.default, favorites_controller_1.default.getUserFavorites);
// @route get /api/users/favorites/ids
// @des Get favorite's ids
router.get('/ids', auth_middleware_1.default, favorites_controller_1.default.getUserFavoritesIds);
// @route POST /api/products/favorite?id=$productId$
// @des Add product to user favorites
router.post('/', auth_middleware_1.default, favorites_controller_1.default.addToFavorite);
// @route DELETE /api/products/favorite?id=$productId$
// @des Remove product from user favorites
router.delete('/', auth_middleware_1.default, favorites_controller_1.default.deleteFromFavorite);
// likes, dislikes, views
router.post('/likes', auth_middleware_1.default, favorites_controller_1.default.addLike);
router.delete('/likes', auth_middleware_1.default, favorites_controller_1.default.deleteLike);
router.post('/dislikes', auth_middleware_1.default, favorites_controller_1.default.addDislike);
router.delete('/dislikes', auth_middleware_1.default, favorites_controller_1.default.deleteDislike);
router.post('/views', auth_middleware_1.default, favorites_controller_1.default.addView);
exports.default = router;
//# sourceMappingURL=favorites.router.js.map