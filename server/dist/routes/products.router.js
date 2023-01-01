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
exports.createProductsRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const products_controller_1 = __importDefault(require("../controllers/products.controller"));
const product_model_1 = __importDefault(require("../db/models/product.model"));
const check_role_middleware_1 = __importDefault(require("../middlewares/check-role.middleware"));
const async_handler_middleware_1 = __importDefault(require("../middlewares/async-handler.middleware"));
const fs_1 = __importDefault(require("fs"));
const replace_spaces_util_1 = require("../utils/replace-spaces.util");
const enums_1 = require("../controllers/types/enums");
function createProductsRoutes() {
    const router = (0, express_1.Router)();
    // Where store download files
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => __awaiter(this, void 0, void 0, function* () {
            if (!req.body.name && req.query.productId) {
                // достаю имя продукта (если его нет в теле запроса (*put)), чтобы создать с ним папку
                const product = yield product_model_1.default.query().select('products.name').from('products').where('products.id', '=', `${req.query.productId}`).first();
                const folder = product.name;
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
    router.get('/', (0, async_handler_middleware_1.default)(products_controller_1.default.getProducts));
    router.get('/statistics/price-dynamics', (0, async_handler_middleware_1.default)(products_controller_1.default.getPriceDynamics));
    router.get('/characteristics', (0, async_handler_middleware_1.default)(products_controller_1.default.getCharacteristics));
    router.get('/menuInfo', (0, async_handler_middleware_1.default)(products_controller_1.default.getDropdownMenuInfo));
    router.get('/statistics', (0, check_role_middleware_1.default)('ADMIN'), (0, async_handler_middleware_1.default)(products_controller_1.default.getStatistics));
    router.get('/:id', (0, async_handler_middleware_1.default)(products_controller_1.default.getProductById));
    // ! Admin panel
    router.use((0, check_role_middleware_1.default)(enums_1.ROLES.ADMIN));
    router.post('/', upload.single('image'), (0, async_handler_middleware_1.default)(products_controller_1.default.addProduct));
    // Add a product images
    router.post('/images', upload.array('image', 5), (0, async_handler_middleware_1.default)(products_controller_1.default.addImage));
    router.patch('/', upload.single('image'), (0, async_handler_middleware_1.default)(products_controller_1.default.updateProduct));
    router.delete('/', (0, async_handler_middleware_1.default)(products_controller_1.default.deleteProduct));
    // Delete a product's images
    router.delete('/images', (0, async_handler_middleware_1.default)(products_controller_1.default.deleteImage));
    return router;
}
exports.createProductsRoutes = createProductsRoutes;
//# sourceMappingURL=products.router.js.map