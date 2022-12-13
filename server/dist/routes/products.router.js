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
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const products_controller_1 = __importDefault(require("../controllers/products.controller"));
const product_model_1 = __importDefault(require("../db/models/product.model"));
const check_role_middleware_1 = __importDefault(require("../middlewares/check-role.middleware"));
const fs_1 = __importDefault(require("fs"));
const replace_spaces_util_1 = require("../utils/replace-spaces.util");
const router = express_1.default.Router();
// Where store download files
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.body.name && req.query.productId) {
            // достаю имя продукта (если его нет в теле запроса (*put)), чтобы создать с ним папку
            const product = yield product_model_1.default.query().select('products.name').from('products').where('products.id', '=', `${req.query.productId}`);
            const folder = product[0].name;
            const path = `./assets/products/${(0, replace_spaces_util_1.replaceSpaces)(folder)}/`;
            fs_1.default.mkdirSync(path, { recursive: true });
            return cb(null, path);
        }
        else {
            const folder = req.body.name;
            const path = `./assets/products/${(0, replace_spaces_util_1.replaceSpaces)(folder)}/`;
            fs_1.default.mkdirSync(path, { recursive: true });
            return cb(null, path);
        }
    }),
    filename: (req, file, callback) => {
        callback(null, path_1.default.parse(file.originalname).name + '-' + Date.now() + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
// @route POST /api/products/ || /api/products?id= || /api/products?category= || /api/products?price=800-1000 etc. || /api/products?orderByPrice=high/low || /api/products?orderByFavoriteStars=high/low
// @des Get products
router.get('/', products_controller_1.default.getProducts);
// @route GET /api/products/statistics?quantity=5
// @des Get products
router.get('/statistics', (0, check_role_middleware_1.default)('ADMIN'), products_controller_1.default.getStatistics);
// @route GET /api/products/statistics/price-dynamics
// @des Get products
router.get('/statistics/price-dynamics', (0, check_role_middleware_1.default)('ADMIN'), products_controller_1.default.getPriceDynamics);
// @route GET /api/products/characteristics?productId=5
// @des Get product characteristics
router.get('/characteristics', products_controller_1.default.getCharacteristics);
// ! Admin panel
// @route POST /api/products/
// @des Add a product
router.post('/', (0, check_role_middleware_1.default)('ADMIN'), upload.single('image'), products_controller_1.default.addProduct);
// @route POST /api/products/images?productId=
// @des Add a product images
router.post('/images', (0, check_role_middleware_1.default)('ADMIN'), upload.single('image'), products_controller_1.default.addImage);
// @route PUT /api/products?productId=
// @des Update the product
router.put('/', (0, check_role_middleware_1.default)('ADMIN'), upload.single('image'), products_controller_1.default.updateProduct);
// @route DELETE /api/products?productId=
// @des Delete a product
router.delete('/', (0, check_role_middleware_1.default)('ADMIN'), products_controller_1.default.deleteProduct);
// @route DELETE /api/products/images?productId=&imageId=
// @des Delete a product's images
router.delete('/images', (0, check_role_middleware_1.default)('ADMIN'), products_controller_1.default.deleteImage);
exports.default = router;
//# sourceMappingURL=products.router.js.map