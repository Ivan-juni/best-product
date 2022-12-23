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
exports.getCategoryChilds = void 0;
const category_model_1 = __importDefault(require("../db/models/category.model"));
const get_category_id_util_1 = require("./get-category-id.util");
const getCategoryChilds = (searchCriteria) => __awaiter(void 0, void 0, void 0, function* () {
    if (searchCriteria.category) {
        let categoryChilds = { categoryIds: '' };
        // находим id написанной категории
        const categoryId = yield (0, get_category_id_util_1.getCategoryId)(searchCriteria.category);
        // находим id дочерних категорий
        const category = category_model_1.default.knex();
        const childResult = yield category.raw(`SELECT GROUP_CONCAT( lv SEPARATOR "," ) AS categoryIds FROM (
                   SELECT @pv:=(
                       SELECT GROUP_CONCAT( id SEPARATOR "," ) FROM categories WHERE FIND_IN_SET( parent, @pv )
                       ) AS lv FROM categories
                       JOIN
                       (SELECT @pv:=${categoryId}) tmp
                   ) a
                   WHERE lv IS NOT NULL;`);
        categoryChilds = childResult[0][0];
        // для корректного поиска также добавляем айди введенной категории
        if (categoryChilds.categoryIds === '' || categoryChilds.categoryIds == null) {
            categoryChilds.categoryIds = `${categoryId}`;
        }
        else {
            categoryChilds.categoryIds.concat(`, ${categoryId}`);
        }
        return categoryChilds;
    }
    else {
        return { categoryIds: '' };
    }
});
exports.getCategoryChilds = getCategoryChilds;
//# sourceMappingURL=get-category-childs.js.map