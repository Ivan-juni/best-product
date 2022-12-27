"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const check_role_middleware_1 = __importDefault(require("../middlewares/check-role.middleware"));
const categories_controller_1 = __importDefault(require("../controllers/categories.controller"));
const router = express_1.default.Router();
// @route GET /api/categories?categoryId=
// @des Get categories
router.get('/', categories_controller_1.default.getCategories);
// ! Admin panel
// @route POST /api/categories
// @des Add the category
router.post('/', (0, check_role_middleware_1.default)('ADMIN'), categories_controller_1.default.addCategory);
// @route PUT /api/categories?categoryId=
// @des Update the category
router.put('/', (0, check_role_middleware_1.default)('ADMIN'), categories_controller_1.default.updateCategory);
// @route DELETE /api/categories?categoryId=
// @des Delete the category
router.delete('/', (0, check_role_middleware_1.default)('ADMIN'), categories_controller_1.default.deleteCategory);
exports.default = router;
//# sourceMappingURL=categories.router.js.map