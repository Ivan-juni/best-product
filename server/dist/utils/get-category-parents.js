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
        // родители введенной категории
        let categoryParents = [];
        // находим id написанной категории
        const categoryId = yield (0, get_category_id_util_1.getCategoryId)(searchCriteria.category);
        // получаем список категорий родителей
        const knex = category_model_1.default.knex();
        const parentResult = yield knex.raw(`SELECT t2.id,
                t2.parent,
                t2.name
                from (
                  select @r as _id,
                    (select @r := parent from categories where id = _id) AS parent,
                    @l := @l + 1 AS lvl from (select @r := ${categoryId}, @l := 0) vars, categories c
                    where @r <> 0) t1
                    join categories t2
                    on  t1._id = t2.id
                    order by t1.lvl desc`);
        categoryParents = parentResult[0];
        return categoryParents;
    }
    else {
        return [];
    }
});
exports.getCategoryParents = getCategoryParents;
//# sourceMappingURL=get-category-parents.js.map