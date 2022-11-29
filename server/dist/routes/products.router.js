"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const products_controller_1 = __importDefault(require("../controllers/products.controller"));
const check_role_middleware_1 = __importDefault(require("../middlewares/check-role.middleware"));
const router = express_1.default.Router();
// Where store download files
const storage = multer_1.default.diskStorage({
    destination: './assets/products',
    filename: (req, file, callback) => {
        callback(null, path_1.default.parse(file.originalname).name +
            '-' +
            Date.now() +
            path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
// @route POST /api/products/ || /api/products?id= || /api/products?category= || /api/products?price=800-1000 etc.
// @des Get products
router.get('/', products_controller_1.default.getProducts);
// @route GET /api/products/statistics?quantity=5
// @des Get products
router.get('/statistics', (0, check_role_middleware_1.default)('ADMIN'), products_controller_1.default.getStatistics);
// @route GET /api/products/characteristics?productId=5
// @des Get product characteristics
router.get('/characteristics', products_controller_1.default.getCharacteristics);
// ! Admin panel
// @route POST /api/products/
// @des Add a product
router.post('/', (0, check_role_middleware_1.default)('ADMIN'), upload.single('image'), products_controller_1.default.addProduct);
// @route PUT /api/products/
// @des Update the product
router.put('/', (0, check_role_middleware_1.default)('ADMIN'), upload.single('image'), products_controller_1.default.updateProduct);
// @route DELETE /api/products?productId=
// @des Delete a product
router.delete('/', (0, check_role_middleware_1.default)('ADMIN'), products_controller_1.default.deleteProducts);
exports.default = router;
//# sourceMappingURL=products.router.js.map