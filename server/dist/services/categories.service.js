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
const category_model_1 = __importDefault(require("../db/models/category.model"));
class CategoriesService {
    static getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return category_model_1.default.query().findById(id);
        });
    }
    static getCategories(searchCriteria) {
        return __awaiter(this, void 0, void 0, function* () {
            return category_model_1.default.query()
                .select()
                .from('categories')
                .where((qb) => {
                if (searchCriteria.categoryId) {
                    qb.where('categories.id', '=', +searchCriteria.categoryId);
                }
                if (searchCriteria.categoryName) {
                    qb.orWhere('categories.name', 'like', `%${searchCriteria.categoryName}%`);
                }
            })
                .page(searchCriteria.page, searchCriteria.limit);
        });
    }
    static addCategory(categoryValues) {
        return __awaiter(this, void 0, void 0, function* () {
            return category_model_1.default.query().insertAndFetch({
                name: categoryValues.name,
                parent: categoryValues.parent,
            });
        });
    }
    static deleteCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return category_model_1.default.query().deleteById(categoryId);
        });
    }
    static updateCategory(categoryId, changingValues) {
        return __awaiter(this, void 0, void 0, function* () {
            // filtering null values
            Object.keys(changingValues).forEach((key) => {
                if (changingValues[key] === null) {
                    delete changingValues[key];
                }
            });
            return category_model_1.default.query().patchAndFetchById(categoryId, changingValues);
        });
    }
}
exports.default = CategoriesService;
//# sourceMappingURL=categories.service.js.map