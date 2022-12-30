"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategoriesRoutes = void 0;
const express_1 = require("express");
const check_role_middleware_1 = __importDefault(require("../middlewares/check-role.middleware"));
const async_handler_middleware_1 = __importDefault(require("../middlewares/async-handler.middleware"));
const categories_controller_1 = __importDefault(require("../controllers/categories.controller"));
const enums_1 = require("../controllers/types/enums");
function createCategoriesRoutes() {
    const router = (0, express_1.Router)();
    router.get('/', (0, async_handler_middleware_1.default)(categories_controller_1.default.getCategories));
    router.get('/:id', (0, async_handler_middleware_1.default)(categories_controller_1.default.getCategoryById));
    // ! Admin panel
    router.use((0, check_role_middleware_1.default)(enums_1.ROLES.ADMIN));
    router.post('/', (0, async_handler_middleware_1.default)(categories_controller_1.default.addCategory));
    // /api/categories?categoryId=
    router.patch('/', (0, async_handler_middleware_1.default)(categories_controller_1.default.updateCategory));
    // /api/categories?categoryId=
    router.delete('/', (0, async_handler_middleware_1.default)(categories_controller_1.default.deleteCategory));
    return router;
}
exports.createCategoriesRoutes = createCategoriesRoutes;
//# sourceMappingURL=categories.router.js.map