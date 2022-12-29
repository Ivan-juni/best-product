"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const async_handler_middleware_1 = __importDefault(require("../middlewares/async-handler.middleware"));
const favorites_controller_1 = __importDefault(require("../controllers/favorites.controller"));
const router = (0, express_1.default)();
router.use(auth_middleware_1.default);
router.get('/', (0, async_handler_middleware_1.default)(favorites_controller_1.default.getUserFavorites));
// Get favorite's ids
router.get('/ids', (0, async_handler_middleware_1.default)(favorites_controller_1.default.getUserFavoritesIds));
router.post('/', (0, async_handler_middleware_1.default)(favorites_controller_1.default.addToFavorite));
// ?id=$productId$
router.delete('/', (0, async_handler_middleware_1.default)(favorites_controller_1.default.deleteFromFavorite));
// likes, dislikes, views
router.post('/likes', (0, async_handler_middleware_1.default)(favorites_controller_1.default.addLike));
router.delete('/likes', (0, async_handler_middleware_1.default)(favorites_controller_1.default.deleteLike));
router.post('/dislikes', (0, async_handler_middleware_1.default)(favorites_controller_1.default.addDislike));
router.delete('/dislikes', (0, async_handler_middleware_1.default)(favorites_controller_1.default.deleteDislike));
router.post('/views', (0, async_handler_middleware_1.default)(favorites_controller_1.default.addView));
exports.default = router;
//# sourceMappingURL=favorites.router.js.map