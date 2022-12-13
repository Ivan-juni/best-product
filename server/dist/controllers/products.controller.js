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
class ProductsController {
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
    // products admin panel
    static deleteProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.query;
            if (!productId) {
                return next(ApiError_1.default.internal('Type product id'));
            }
            const result = yield products_service_1.default.deleteProduct(+productId);
            if (!result) {
                return next(ApiError_1.default.badRequest(`Deletion products error`));
            }
            if (typeof result == 'number') {
                return res.json({ message: `Successfully deleted product (id=${productId})` });
            }
            else {
                return res.json(result);
            }
        });
    }
    static deleteImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId, imageId } = req.query;
            if (!productId) {
                return next(ApiError_1.default.internal('Please, type the product id'));
            }
            if (!imageId) {
                return next(ApiError_1.default.internal('Please, type the image id'));
            }
            const result = yield products_service_1.default.deleteImage(+productId, +imageId);
            if (!result) {
                return next(ApiError_1.default.badRequest(`Deletion images error`));
            }
            if (typeof result == 'number') {
                return res.json({ message: `Successfully deleted image (id=${imageId})` });
            }
            else {
                return res.json(result);
            }
        });
    }
    static addImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.query;
            const fileName = req.file !== undefined ? req.file.filename : null;
            if (!productId) {
                return next(ApiError_1.default.internal('Please, type product id'));
            }
            if (!fileName || fileName == undefined) {
                return next(ApiError_1.default.internal('Please, add image'));
            }
            const insertedImage = yield products_service_1.default.addImage(+productId, fileName);
            if (!insertedImage) {
                return next(ApiError_1.default.badRequest(`Adding image error`));
            }
            return res.json(insertedImage);
        });
    }
    static addProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const productInfo = req.body;
            const image = req.file !== undefined ? req.file.filename : null;
            let microphone = null;
            if (productInfo.microphone) {
                if (productInfo.microphone === 'true') {
                    microphone = true;
                }
                else {
                    microphone = false;
                }
            }
            if (!productInfo.name) {
                return next(ApiError_1.default.internal('Please, add name'));
            }
            if (!image || image == undefined) {
                return next(ApiError_1.default.internal('Please, add image'));
            }
            else {
                productInfo.image = `http://localhost:${process.env.PORT}/static/products/${(0, replace_spaces_util_1.replaceSpaces)(productInfo.name)}/${image}`;
            }
            if (!productInfo.price) {
                return next(ApiError_1.default.internal('Please, add price'));
            }
            if (!productInfo.categoryId) {
                return next(ApiError_1.default.internal('Please, add category id'));
            }
            if (!productInfo.purpose) {
                return next(ApiError_1.default.internal('Please, add purpose'));
            }
            if (!productInfo.description) {
                return next(ApiError_1.default.internal('Please, add description'));
            }
            const product = yield products_service_1.default.addProduct({
                price: +productInfo.price || null,
                categoryId: +productInfo.categoryId || null,
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
            try {
                const { productId } = req.query;
                const changingValues = req.body;
                const image = req.file !== undefined ? req.file.filename : null;
                let microphone = null;
                if (!productId) {
                    return next(ApiError_1.default.badRequest('Please, type the product id'));
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
                    const product = yield product_model_1.default.query().select('products.name').from('products').where('products.id', '=', `${productId}`);
                    changingValues.image = `http://localhost:${process.env.PORT}/static/products/${(0, replace_spaces_util_1.replaceSpaces)(product[0].name)}/${image}`;
                }
                const product = yield products_service_1.default.updateProduct(+productId, {
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
            }
            catch (error) {
                console.log(error);
                return next(ApiError_1.default.badRequest(`${error.message}`));
            }
        });
    }
}
exports.default = ProductsController;
//# sourceMappingURL=products.controller.js.map