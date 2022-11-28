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
const product_model_1 = __importDefault(require("../db/models/product/product.model"));
class ProductService {
    static getProducts(searchCriteria) {
        return __awaiter(this, void 0, void 0, function* () {
            let categoryChilds = { categoryIds: '' };
            let categoryParents = [];
            const limit = +searchCriteria.limit || 5;
            const page = +searchCriteria.page || 0;
            const findInRange = (qb, parametr) => {
                const parametrArray = searchCriteria[parametr].split('-');
                if (parametrArray.length > 1 && parametrArray[1]) {
                    // Ex: if ?parametr=400-1000
                    qb.andWhere(`products.${parametr}`, '>=', +parametrArray[0]).andWhere(`products.${parametr}`, '<=', +parametrArray[1]);
                }
                else if (parametrArray.length == 1 && !parametrArray[1]) {
                    // Ex: if ?parametr=400
                    qb.andWhere(`products.${parametr}`, '>=', +parametrArray[0]);
                }
            };
            const getCategoryId = () => __awaiter(this, void 0, void 0, function* () {
                // находим id написанной категории
                const categoryId = yield category_model_1.default.query()
                    .select('categories.id')
                    .where('categories.name', '=', `${searchCriteria.category}`);
                return categoryId[0].id;
            });
            try {
                if (searchCriteria.category) {
                    // находим id написанной категории
                    const categoryId = yield getCategoryId();
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
                    // находим id дочерних категорий
                    const childResult = yield knex.raw(`SELECT GROUP_CONCAT( lv SEPARATOR "," ) AS categoryIds FROM (
              SELECT @pv:=(
                  SELECT GROUP_CONCAT( id SEPARATOR "," ) FROM categories WHERE FIND_IN_SET( parent, @pv )
                  ) AS lv FROM categories
                  JOIN
                  (SELECT @pv:=${categoryId}) tmp
              ) a
              WHERE lv IS NOT NULL;`);
                    categoryChilds = childResult[0][0];
                    // для корректного поиска также добавляем айди введенной категории
                    if (categoryChilds.categoryIds === '' ||
                        categoryChilds.categoryIds == null) {
                        categoryChilds.categoryIds = `${categoryId}`;
                    }
                    else {
                        categoryChilds.categoryIds.concat(`, ${categoryId}`);
                    }
                }
                const products = yield product_model_1.default.query()
                    .select()
                    .from('products')
                    .where((qb) => {
                    if (searchCriteria.category) {
                        // получаем товары из данной категории и дочерних
                        qb.whereIn('categories.id', categoryChilds.categoryIds.split(','));
                    }
                    if (searchCriteria.id) {
                        qb.andWhere('products.id', '=', +searchCriteria.id);
                    }
                    if (searchCriteria.name) {
                        qb.andWhere('products.name', 'like', `%${searchCriteria.name}%`);
                    }
                    if (searchCriteria.purpose) {
                        qb.andWhere('products.purpose', 'like', `%${searchCriteria.purpose}%`);
                    }
                    if (searchCriteria.price) {
                        findInRange(qb, 'price');
                    }
                    if (searchCriteria.views) {
                        findInRange(qb, 'views');
                    }
                    if (searchCriteria.likes) {
                        findInRange(qb, 'likes');
                    }
                    if (searchCriteria.dislikes) {
                        findInRange(qb, 'dislikes');
                    }
                    if (searchCriteria.favoriteStars) {
                        findInRange(qb, 'favoriteStars');
                    }
                })
                    .innerJoin('categories', 'products.categoryId', 'categories.id')
                    .page(page, limit);
                // записываем в объект результат
                if (categoryParents) {
                    return {
                        products: products.results,
                        categories: categoryParents,
                        total: products.total,
                    };
                }
                else {
                    return Object.assign({}, products);
                }
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
    static getStatistics(quantity = 5) {
        return __awaiter(this, void 0, void 0, function* () {
            // 5 most viewed/liked/disliked/added to favorites
            try {
                const views = yield product_model_1.default.query()
                    .select('name', 'views')
                    .orderBy('views', 'desc')
                    .limit(quantity);
                const likes = yield product_model_1.default.query()
                    .select('name', 'likes')
                    .orderBy('likes', 'desc')
                    .limit(quantity);
                const dislikes = yield product_model_1.default.query()
                    .select('name', 'dislikes')
                    .orderBy('dislikes', 'desc')
                    .limit(quantity);
                const favoriteStars = yield product_model_1.default.query()
                    .select('name', 'favoriteStars')
                    .orderBy('favoriteStars', 'desc')
                    .limit(quantity);
                return {
                    topViews: views,
                    topLikes: likes,
                    topDislikes: dislikes,
                    topFavoriteStars: favoriteStars,
                };
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
    static addToFavorite(id) {
        return __awaiter(this, void 0, void 0, function* () {
            //!todo
            try {
                // add to favorite and increment 'favorites' option in Product model
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
    static deleteFromFavorite(id) {
        return __awaiter(this, void 0, void 0, function* () {
            //!todo
            try {
                // delete from favorite and decrement 'favorites' option in Product model
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
}
exports.default = ProductService;
//# sourceMappingURL=products.service.temp.js.map