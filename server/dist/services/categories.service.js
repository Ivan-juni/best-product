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
const category_model_1 = __importDefault(require("../db/models/category/category.model"));
class CategoriesService {
    static getCategories(searchCriteria) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = +searchCriteria.limit || 5;
                const page = +searchCriteria.page || 0;
                const categories = yield category_model_1.default.query()
                    .select()
                    .from('categories')
                    .where((qb) => {
                    if (searchCriteria.categoryId) {
                        qb.where('categories.id', '=', +searchCriteria.categoryId);
                    }
                })
                    .page(page, limit);
                return categories;
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
    static addCategory(categoryValues) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productCategory = yield category_model_1.default.query().findOne({
                    name: categoryValues.name,
                });
                if (productCategory) {
                    return productCategory;
                }
                const category = yield category_model_1.default.query().insertAndFetch({
                    name: categoryValues.name,
                    parent: categoryValues.parent,
                });
                return category;
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
    static deleteCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield category_model_1.default.query().findById(categoryId);
                if (!category) {
                    return { message: "This product isn't on your favorites" };
                }
                const deletedCategories = yield category_model_1.default.query().deleteById(categoryId);
                return deletedCategories;
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
}
exports.default = CategoriesService;
//# sourceMappingURL=categories.service.js.map