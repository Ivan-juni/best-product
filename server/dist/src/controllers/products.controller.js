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
const comments_service_1 = __importDefault(require("../services/comments.service"));
const favorites_service_1 = __importDefault(require("../services/favorites.service"));
const categories_service_1 = __importDefault(require("../services/categories.service"));
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
    // favorites
    static addToFavorite(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            const { productId } = req.query;
            if (!productId) {
                return next(ApiError_1.default.internal('Type product id'));
            }
            if (!id) {
                return next(ApiError_1.default.unAuthorizedError());
            }
            const favorites = yield favorites_service_1.default.addToFavorite(+id, +productId);
            if (!favorites) {
                return next(ApiError_1.default.badRequest(`Adding to favorites error`));
            }
            return res.json(favorites);
        });
    }
    static deleteFromFavorite(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            const { productId } = req.query;
            if (!productId) {
                return next(ApiError_1.default.internal('Type product id'));
            }
            if (!id) {
                return next(ApiError_1.default.unAuthorizedError());
            }
            const result = yield favorites_service_1.default.deleteFromFavorite(+id, +productId);
            if (!result) {
                return next(ApiError_1.default.badRequest(`Adding to favorites error`));
            }
            if (typeof result == 'number') {
                return res.json({
                    message: `Successfully deleted ${result} queries`,
                });
            }
            else {
                return res.json(result);
            }
        });
    }
    // comments
    static addComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            const { productId } = req.query;
            const commentText = req.body.text;
            if (!productId) {
                return next(ApiError_1.default.internal('Type product id'));
            }
            if (!commentText) {
                return next(ApiError_1.default.internal('Please, type the cooment text'));
            }
            if (!id) {
                return next(ApiError_1.default.unAuthorizedError());
            }
            const comment = yield comments_service_1.default.addComment(+id, +productId, commentText);
            if (!comment) {
                return next(ApiError_1.default.badRequest(`Adding comment error`));
            }
            return res.json(comment);
        });
    }
    static deleteComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            const { commentId } = req.query;
            if (!commentId) {
                return next(ApiError_1.default.internal('Type comment id'));
            }
            if (!id) {
                return next(ApiError_1.default.unAuthorizedError());
            }
            const result = yield comments_service_1.default.deleteComment(+id, +commentId);
            if (!result) {
                return next(ApiError_1.default.badRequest(`Deletion comment error`));
            }
            if (typeof result == 'number') {
                return res.json({ message: `Successfully deleted ${result} comments` });
            }
            else {
                return res.json(result);
            }
        });
    }
    static getProductComments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.query;
            const page = +req.query.page || 0;
            const limit = +req.query.page || 5;
            if (!productId) {
                return next(ApiError_1.default.internal('Type the product id'));
            }
            const comments = yield comments_service_1.default.getProductComments(+productId, page, limit);
            if (!comments) {
                return next(ApiError_1.default.badRequest(`Fetching comments error`));
            }
            return res.json(comments);
        });
    }
    // products admin panel
    static deleteProducts(req, res, next) {
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
                return res.json({ message: `Successfully deleted ${result} products` });
            }
            else {
                return res.json(result);
            }
        });
    }
    static addProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const productInfo = req.body;
            const image = req.file.filename;
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
            if (!image) {
                return next(ApiError_1.default.internal('Please, add image'));
            }
            else {
                productInfo.image = `http://localhost:${process.env.PORT}/static/products/${image}`;
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
                const image = req.file.filename;
                let microphone = null;
                if (!productId) {
                    return next(ApiError_1.default.badRequest('Please, type the product id'));
                }
                if (changingValues.microphone) {
                    if (changingValues.microphone === 'true') {
                        changingValues.microphone = true;
                    }
                    else {
                        changingValues.microphone = false;
                    }
                }
                if (image) {
                    changingValues.image = `http://localhost:${process.env.PORT}/static/products/${image}`;
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
                return res.json({ Error: error.message });
            }
        });
    }
    // categories
    static addCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { categoryId } = req.query;
            const categoryName = req.body.name;
            const parent = req.body.parent || 0;
            if (!categoryId) {
                return next(ApiError_1.default.internal('Please, type the category id'));
            }
            if (!categoryName) {
                return next(ApiError_1.default.internal('Please, type the category name'));
            }
            if (!parent) {
                return next(ApiError_1.default.internal('Please, type the category parent'));
            }
            const category = yield categories_service_1.default.addCategory({
                name: categoryName,
                parent: +parent,
            });
            if (!category) {
                return next(ApiError_1.default.badRequest(`Adding category error`));
            }
            return res.json(category);
        });
    }
    static deleteCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { categoryId } = req.query;
            if (!categoryId) {
                return next(ApiError_1.default.internal('Please, type the category id'));
            }
            const result = yield categories_service_1.default.deleteCategory(+categoryId);
            if (!result) {
                return next(ApiError_1.default.badRequest(`Deletion category error`));
            }
            if (typeof result == 'number') {
                return res.json({ message: `Successfully deleted ${result} categories` });
            }
            else {
                return res.json(result);
            }
        });
    }
    static getCategories(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryId = +req.query.categoryId || null;
            const page = +req.query.page || 0;
            const limit = +req.query.page || 5;
            const categories = yield categories_service_1.default.getCategories({
                categoryId,
                page,
                limit,
            });
            if (!categories) {
                return next(ApiError_1.default.badRequest(`Fetching categories error`));
            }
            return res.json(categories);
        });
    }
}
exports.default = ProductsController;
//# sourceMappingURL=products.controller.js.map