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
exports.getCategoryParents = void 0;
const category_model_1 = __importDefault(require("../db/models/category.model"));
const get_category_id_util_1 = require("./get-category-id.util");
const getCategoryParents = (searchCriteria) => __awaiter(void 0, void 0, void 0, function* () {
    if (searchCriteria.category) {
        // находим id написанной категории
        const categoryId = yield (0, get_category_id_util_1.getCategoryId)(searchCriteria.category);
        // получаем список категорий родителей
        const knex = category_model_1.default.knex();
        const parentResult = yield knex.raw(`WITH RECURSIVE cte(id, parent, name) as 
                        (
                        SELECT id, parent, name FROM categories WHERE id = ${categoryId}
                        UNION ALL
                        
                        SELECT c.id, c.parent, c.name
                        FROM categories c
                        INNER JOIN cte on c.id = cte.parent
                        )
                        SELECT * FROM cte ORDER BY id ASC`);
        const categoryParents = parentResult[0];
        return categoryParents;
    }
    else {
        return [];
    }
});
exports.getCategoryParents = getCategoryParents;
//# sourceMappingURL=get-category-parents.js.map