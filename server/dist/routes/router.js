"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_router_1 = require("./auth.router");
const products_router_1 = require("./products.router");
const users_router_1 = require("./users.router");
const favorites_router_1 = require("./favorites.router");
const comments_router_1 = require("./comments.router");
const categories_router_1 = require("./categories.router");
const router = express_1.default.Router();
router.use('/auth', (0, auth_router_1.createAuthRoutes)());
router.use('/products', (0, products_router_1.createProductsRoutes)());
router.use('/users', (0, users_router_1.createUsersRoutes)());
router.use('/favorites', (0, favorites_router_1.createFavoritesRoutes)());
router.use('/comments', (0, comments_router_1.createCommentsRoutes)());
router.use('/categories', (0, categories_router_1.createCategoriesRoutes)());
exports.default = router;
//# sourceMappingURL=router.js.map