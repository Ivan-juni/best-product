"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const check_role_middleware_1 = __importDefault(require("../middlewares/check-role.middleware"));
const async_handler_middleware_1 = __importDefault(require("../middlewares/async-handler.middleware"));
const categories_controller_1 = __importDefault(require("../controllers/categories.controller"));
const router = express_1.default.Router();
router.get('/:id', (0, async_handler_middleware_1.default)(categories_controller_1.default.getCategoryById));
router.get('/', (0, async_handler_middleware_1.default)(categories_controller_1.default.getCategories));
// ! Admin panel
router.use((0, check_role_middleware_1.default)('ADMIN'));
router.post('/', (0, async_handler_middleware_1.default)(categories_controller_1.default.addCategory));
// /api/categories?categoryId=
router.patch('/', (0, async_handler_middleware_1.default)(categories_controller_1.default.updateCategory));
// /api/categories?categoryId=
router.delete('/', (0, async_handler_middleware_1.default)(categories_controller_1.default.deleteCategory));
exports.default = router;
//# sourceMappingURL=categories.router.js.map