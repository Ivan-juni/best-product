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
const product_characteristics_model_1 = __importDefault(require("../db/models/product-characteristics/product-characteristics.model"));
const product_model_1 = __importDefault(require("../db/models/product/product.model"));
const category_model_1 = __importDefault(require("../db/models/category/category.model"));
const find_in_range_util_1 = require("../utils/find-in-range.util");
const get_category_id_util_1 = require("../utils/get-category-id.util");
const remove_photo_util_1 = require("../utils/remove-photo.util");
const sort_by_util_1 = require("../utils/sort-by.util");
class ProductService {
    static getProducts(searchCriteria) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // введенная категория и её дочерние
                let categoryChilds = { categoryIds: '' };
                // родители введенной категории
                let categoryParents = [];
                // пагинация
                const limit = +searchCriteria.limit || 5;
                const page = +searchCriteria.page || 0;
                if (searchCriteria.category) {
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
                // параметры для сортировки
                const sortParams = (0, sort_by_util_1.sort)(searchCriteria, ['price', 'favoriteStars']);
                // запрос в базу
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
                        (0, find_in_range_util_1.findInRange)(qb, 'price', searchCriteria);
                    }
                    if (searchCriteria.views) {
                        (0, find_in_range_util_1.findInRange)(qb, 'views', searchCriteria);
                    }
                    if (searchCriteria.likes) {
                        (0, find_in_range_util_1.findInRange)(qb, 'likes', searchCriteria);
                    }
                    if (searchCriteria.dislikes) {
                        (0, find_in_range_util_1.findInRange)(qb, 'dislikes', searchCriteria);
                    }
                    if (searchCriteria.favoriteStars) {
                        (0, find_in_range_util_1.findInRange)(qb, 'favoriteStars', searchCriteria);
                    }
                })
                    .innerJoin('categories', 'products.categoryId', 'categories.id')
                    .orderBy(sortParams.column, sortParams.order)
                    .page(page, limit);
                // записываем в объект результат
                if (searchCriteria.category) {
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
    static getCharacteristics(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const characteristics = yield product_model_1.default.query()
                    .select('products.id as productId', 'products.name as productName', 'product_characteristics.*')
                    .where('products.id', '=', productId)
                    .innerJoin('product_characteristics', 'product_characteristics.id', 'products.characteristicsId');
                return characteristics;
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
    static deleteProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield product_model_1.default.query().findById(productId);
                if (!product) {
                    return { message: "Can't find this products" };
                }
                // Remove product image from server folder
                (0, remove_photo_util_1.removePhoto)(product.image, 'products');
                const deletedProducts = yield product_model_1.default.query().deleteById(productId);
                yield product_characteristics_model_1.default.query().deleteById(product.characteristicsId);
                return deletedProducts;
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
    static addProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const characteristics = yield product_characteristics_model_1.default.query().insert({
                    purpose: product.purpose,
                    description: product.description,
                    design: product.design,
                    connectionType: product.connectionType,
                    microphone: product.microphone,
                    batteryLiveTime: product.batteryLiveTime,
                    display: product.display,
                });
                return product_model_1.default.query().insert({
                    name: product.name,
                    price: +product.price,
                    image: product.image,
                    categoryId: +product.categoryId,
                    characteristicsId: +characteristics.id,
                });
            }
            catch (error) {
                console.log('Error: ', error);
                (0, remove_photo_util_1.removePhoto)(product.image, 'products');
                return null;
            }
        });
    }
    static updateProduct(productId, changingValues) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oldProduct = yield product_model_1.default.query().select().findById(productId);
                if (!oldProduct) {
                    return { message: "Can't find this product" };
                }
                // Remove old image
                (0, remove_photo_util_1.removePhoto)(oldProduct.image, 'products');
                // filtering null values
                Object.keys(changingValues).forEach((key) => {
                    if (changingValues[key] === null) {
                        delete changingValues[key];
                    }
                });
                return product_model_1.default.query().patchAndFetchById(productId, changingValues);
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
}
exports.default = ProductService;
//# sourceMappingURL=products.service.js.map