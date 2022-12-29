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
const products_service_1 = __importDefault(require("../services/products.service"));
const product_model_1 = __importDefault(require("../db/models/product.model"));
const replace_spaces_util_1 = require("../utils/replace-spaces.util");
const image_module_1 = __importDefault(require("../db/models/image.module"));
const schemas_1 = require("./types/schemas");
class ProductsController {
    static getProductById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            // if (!id) {
            //   return next(ApiError.internal('Please, type the product id'))
            // }
            const products = yield products_service_1.default.getProductById(+id);
            if (!products) {
                return next(ApiError_1.default.badRequest(`Fetching product error`));
            }
            return res.json(products);
        });
    }
    static getProducts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield products_service_1.default.getProducts(req.query);
            if (!products) {
                return next(ApiError_1.default.badRequest(`Fetching products error`));
            }
            return res.json(products);
        });
    }
    static getStatistics(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const quantity = +req.query.quantity || 5;
            const products = yield products_service_1.default.getStatistics(quantity);
            if (!products) {
                return next(ApiError_1.default.badRequest(`Fetching products error`));
            }
            return res.json(products);
        });
    }
    static getPriceDynamics(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.query;
            if (!productId || isNaN(+productId)) {
                return next(ApiError_1.default.badRequest(`Please, type the product id`));
            }
            const priceDynamics = yield products_service_1.default.getPriceDynamics(+productId);
            if (!priceDynamics) {
                return next(ApiError_1.default.badRequest(`Fetching price dynamics error`));
            }
            return res.json(priceDynamics);
        });
    }
    static getCharacteristics(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.query;
            const characteristics = yield products_service_1.default.getCharacteristics(+productId);
            if (!characteristics) {
                return next(ApiError_1.default.badRequest(`Fetching characteristics error`));
            }
            return res.json(characteristics);
        });
    }
    static getDropdownMenuInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = yield products_service_1.default.getMenuInfo(req.query);
            if (!info) {
                return next(ApiError_1.default.badRequest(`Fetching info error`));
            }
            return res.json(info);
        });
    }
    // products admin panel
    static deleteProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.query;
            if (!productId) {
                return next(ApiError_1.default.internal('Type product id'));
            }
            const product = yield product_model_1.default.query().findById(+productId);
            if (!product) {
                return next(ApiError_1.default.internal("Can't find this product"));
            }
            const result = yield products_service_1.default.deleteProduct(product.name, +productId, product.characteristicsId);
            if (!result) {
                return next(ApiError_1.default.badRequest(`Deletion products error`));
            }
            else {
                return res.json({ message: `Successfully deleted product (id=${productId})` });
            }
        });
    }
    static deleteImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId, imageId } = req.query;
            if (!productId) {
                return next(ApiError_1.default.internal('Please, type the product id'));
            }
            const product = yield product_model_1.default.query().findById(+productId);
            if (!product) {
                return next(ApiError_1.default.internal("Can't find this product"));
            }
            if (!imageId) {
                return next(ApiError_1.default.internal('Please, type the image id'));
            }
            const image = yield image_module_1.default.query().findById(+imageId);
            if (!image) {
                return next(ApiError_1.default.internal("Can't find this image"));
            }
            const result = yield products_service_1.default.deleteImage(product.name, image.src, +imageId);
            if (!result) {
                return next(ApiError_1.default.badRequest(`Deletion images error`));
            }
            else {
                return res.json({ message: `Successfully deleted image (id=${imageId})` });
            }
        });
    }
    static addProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const productInfo = req.body;
            const image = req.file !== undefined ? req.file.filename : null;
            let microphone = false;
            yield schemas_1.addProductSchema.validate(Object.assign(Object.assign({}, productInfo), { image }));
            const candidate = yield product_model_1.default.query().select('name').where({ name: productInfo.name }).first();
            if (candidate) {
                next(ApiError_1.default.internal(`Name should be unique, (${candidate.name} already exists)`));
            }
            if (productInfo.microphone) {
                if (productInfo.microphone === 'true') {
                    microphone = true;
                }
                else {
                    microphone = false;
                }
            }
            productInfo.image = `http://localhost:${process.env.PORT}/static/products/${(0, replace_spaces_util_1.replaceSpaces)(productInfo.name)}/${image}`;
            const product = yield products_service_1.default.addProduct({
                price: +productInfo.price,
                categoryId: +productInfo.categoryId,
                name: productInfo.name,
                image: productInfo.image,
                purpose: productInfo.purpose,
                description: productInfo.description,
                design: productInfo.design,
                connectionType: productInfo.connectionType,
                microphone: microphone,
                batteryLiveTime: +productInfo.batteryLiveTime || null,
                display: productInfo.display,
            });
            if (!product) {
                return next(ApiError_1.default.badRequest(`Adding product error`));
            }
            return res.json(product);
        });
    }
    static updateProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.query;
            const changingValues = req.body;
            const image = req.file !== undefined ? req.file.filename : null;
            let microphone = null;
            if (changingValues.name) {
                const candidate = yield product_model_1.default.query().select('name').where({ name: changingValues.name }).first();
                if (candidate) {
                    next(ApiError_1.default.internal(`Name should be unique, (${candidate.name} already exists)`));
                }
            }
            yield schemas_1.updateProductSchema.validate(Object.assign(Object.assign({}, changingValues), { image }));
            if (!productId) {
                return next(ApiError_1.default.badRequest('Please, type the product id'));
            }
            const oldProduct = yield product_model_1.default.query().select().findById(+productId);
            if (!oldProduct) {
                throw new Error("Can't find this product");
            }
            if (changingValues.microphone) {
                if (changingValues.microphone === 'true') {
                    microphone = true;
                }
                else {
                    microphone = false;
                }
            }
            if (image) {
                const product = yield product_model_1.default.query().select('products.name').from('products').where('products.id', '=', `${productId}`).first();
                changingValues.image = `http://localhost:${process.env.PORT}/static/products/${(0, replace_spaces_util_1.replaceSpaces)(product.name)}/${image}`;
            }
            const product = yield products_service_1.default.updateProduct(oldProduct.name, oldProduct.image, +productId, {
                price: +changingValues.price || null,
                categoryId: +changingValues.categoryId || null,
                name: changingValues.name,
                image: changingValues.image,
                purpose: changingValues.purpose,
                description: changingValues.description,
                design: changingValues.design,
                connectionType: changingValues.connectionType,
                microphone: microphone,
                batteryLiveTime: +changingValues.batteryLiveTime || null,
                display: changingValues.display,
            });
            if (!product) {
                return next(ApiError_1.default.badRequest(`Updating product error`));
            }
            return res.json(product);
        });
    }
    static addImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.query;
            const files = req.files !== undefined ? req.files : null;
            if (!productId) {
                return next(ApiError_1.default.internal('Please, type product id'));
            }
            if (!files || files == undefined) {
                return next(ApiError_1.default.internal('Please, add image'));
            }
            const insertedImages = yield products_service_1.default.addImage(+productId, files);
            if (!insertedImages) {
                return next(ApiError_1.default.badRequest(`Adding image error`));
            }
            return res.json(insertedImages);
        });
    }
}
exports.default = ProductsController;
//# sourceMappingURL=products.controller.js.map