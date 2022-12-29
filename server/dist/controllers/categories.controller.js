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
const categories_service_1 = __importDefault(require("../services/categories.service"));
const category_model_1 = __importDefault(require("../db/models/category.model"));
const schemas_1 = require("./types/schemas");
class CategoriesController {
    static getCategoryById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const category = yield categories_service_1.default.getCategoryById(+id);
            if (!category) {
                return next(ApiError_1.default.badRequest(`Fetching category error`));
            }
            return res.json(category);
        });
    }
    static getCategories(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryId = +req.query.id || null;
            const categoryName = req.query.name || null;
            const limit = +req.query.limit || 5;
            const page = +req.query.page || 0;
            const categories = yield categories_service_1.default.getCategories({
                categoryId,
                categoryName: categoryName ? categoryName.toString() : null,
                limit,
                page,
            });
            if (!categories) {
                return next(ApiError_1.default.badRequest(`Fetching categories error`));
            }
            return res.json(categories);
        });
    }
    static addCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryName = req.body.name;
            const parent = req.body.parent ? +req.body.parent : 0;
            yield schemas_1.addCategorySchema.validate({ categoryName, parent });
            const productCategory = yield category_model_1.default.query().findOne({
                name: categoryName,
            });
            if (productCategory) {
                return next(ApiError_1.default.internal('Category with this name already exists'));
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
    static updateCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { categoryId } = req.query;
            const changingValues = req.body;
            if (!categoryId) {
                return next(ApiError_1.default.badRequest('Please, type the category id'));
            }
            const oldCategory = yield category_model_1.default.query().select().findById(+categoryId);
            if (!oldCategory) {
                return next(ApiError_1.default.internal("Can't find this category"));
            }
            yield schemas_1.updCategorySchema.validate(changingValues);
            const category = yield categories_service_1.default.updateCategory(+categoryId, {
                name: changingValues.name ? changingValues.name : null,
                parent: changingValues.parent ? +changingValues.parent : null,
            });
            if (!category) {
                return next(ApiError_1.default.badRequest(`Updating category error`));
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
            const oldCategory = yield category_model_1.default.query().select().findById(+categoryId);
            if (!oldCategory) {
                return next(ApiError_1.default.internal("Can't find this category"));
            }
            const result = yield categories_service_1.default.deleteCategory(+categoryId);
            if (!result) {
                return next(ApiError_1.default.badRequest(`Deletion category error`));
            }
            else {
                return res.json({ message: `Successfully deleted ${result} categories` });
            }
        });
    }
}
exports.default = CategoriesController;
//# sourceMappingURL=categories.controller.js.map