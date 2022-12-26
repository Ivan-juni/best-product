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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_characteristics_model_1 = __importDefault(require("../db/models/product-characteristics.model"));
const product_model_1 = __importDefault(require("../db/models/product.model"));
const remove_photo_util_1 = require("../utils/remove-photo.util");
const sort_by_util_1 = require("../utils/sort-by.util");
const favorite_model_1 = __importDefault(require("../db/models/favorite.model"));
const product_history_model_1 = __importDefault(require("../db/models/product-history.model"));
const find_products_util_1 = require("../utils/find-products.util");
const replace_spaces_util_1 = require("../utils/replace-spaces.util");
const image_module_1 = __importDefault(require("../db/models/image.module"));
const get_category_childs_1 = require("../utils/get-category-childs");
const get_category_parents_1 = require("../utils/get-category-parents");
class ProductService {
    static getProducts(searchCriteria) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // введенная категория и её дочерние
                const categoryChilds = yield (0, get_category_childs_1.getCategoryChilds)(searchCriteria);
                // родители введенной категории
                const categoryParents = yield (0, get_category_parents_1.getCategoryParents)(searchCriteria);
                // пагинация
                const limit = +searchCriteria.limit || 5;
                const page = +searchCriteria.page || 0;
                // параметры для сортировки
                const sortParams = (0, sort_by_util_1.sort)(searchCriteria, ['price', 'favoriteStars']);
                // запрос в базу
                const products = yield product_model_1.default.query()
                    .select('products.id', 'products.name', 'products.price', 'products.image', 'products.likes', 'products.dislikes', 'products.views', 'products.favoriteStars', 'products.createdAt', 'products.updatedAt')
                    .from('products')
                    .where((qb) => {
                    if (searchCriteria.category) {
                        // получаем товары из данной категории и дочерних
                        qb.whereIn('categories.id', categoryChilds.categoryIds.split(','));
                    }
                    // id, name, purpose, display, connectionType, microphone, price, views, likes, dislikes, favoriteStars
                    (0, find_products_util_1.findProducts)(qb, searchCriteria);
                })
                    .innerJoin('product_characteristics', 'product_characteristics.id', 'products.characteristicsId')
                    .innerJoin('categories', 'categories.id', 'products.categoryId')
                    .withGraphFetched('[category(selectNameIdParent), characteristics, images(selectIdAndSrc)]')
                    .orderBy(`products.${sortParams.column}`, sortParams.order)
                    .page(page, limit);
                // записываем в объект результат
                if (searchCriteria.category) {
                    return {
                        results: products.results,
                        categories: categoryParents,
                        total: products.total,
                    };
                }
                else {
                    return products;
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
                const views = yield product_model_1.default.query().select('id', 'name', 'views').orderBy('views', 'desc').limit(quantity);
                const likes = yield product_model_1.default.query().select('id', 'name', 'likes').orderBy('likes', 'desc').limit(quantity);
                const dislikes = yield product_model_1.default.query().select('id', 'name', 'dislikes').orderBy('dislikes', 'desc').limit(quantity);
                const favoriteStars = yield product_model_1.default.query().select('id', 'name', 'favoriteStars').orderBy('favoriteStars', 'desc').limit(quantity);
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
    static getPriceDynamics(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const priceDynamics = yield product_history_model_1.default.query()
                    .select('price', 'name', 'action', 'revision', 'datetime', 'id as productId')
                    .where({ id: productId })
                    .orderBy('revision', 'asc');
                return priceDynamics;
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
    static getMenuInfo(searchCriteria) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const info = {
                    purpose: [],
                    connectionType: [],
                    display: [],
                    design: [],
                    price: [],
                };
                // введенная категория и её дочерние
                const categoryChilds = yield (0, get_category_childs_1.getCategoryChilds)(searchCriteria);
                const priceMin = yield product_model_1.default.query()
                    .min('products.price as price')
                    .where((qb) => {
                    if (searchCriteria.category) {
                        // получаем товары из данной категории и дочерних
                        qb.whereIn('categories.id', categoryChilds.categoryIds.split(','));
                    }
                    // id, name, purpose, display, connectionType, microphone, price, views, likes, dislikes, favoriteStars
                    (0, find_products_util_1.findProducts)(qb, searchCriteria);
                })
                    .innerJoin('product_characteristics', 'product_characteristics.id', 'products.characteristicsId')
                    .innerJoin('categories', 'categories.id', 'products.categoryId');
                const priceMax = yield product_model_1.default.query()
                    .max('products.price as price')
                    .where((qb) => {
                    if (searchCriteria.category) {
                        // получаем товары из данной категории и дочерних
                        qb.whereIn('categories.id', categoryChilds.categoryIds.split(','));
                    }
                    // id, name, purpose, display, connectionType, microphone, price, views, likes, dislikes, favoriteStars
                    (0, find_products_util_1.findProducts)(qb, searchCriteria);
                })
                    .innerJoin('product_characteristics', 'product_characteristics.id', 'products.characteristicsId')
                    .innerJoin('categories', 'categories.id', 'products.categoryId');
                info.price[0] = `${priceMin[0].price}`;
                info.price[1] = `${priceMax[0].price}`;
                const knex = product_characteristics_model_1.default.knex();
                const _purpose = yield knex.raw('SELECT GROUP_CONCAT(DISTINCT purpose ORDER BY purpose ASC SEPARATOR "," ) AS purpose FROM product_characteristics');
                const _connectionType = yield knex.raw('SELECT GROUP_CONCAT(DISTINCT connectionType ORDER BY connectionType ASC SEPARATOR "," ) AS connectionType FROM product_characteristics');
                const _display = yield knex.raw('SELECT GROUP_CONCAT(DISTINCT display ORDER BY display ASC SEPARATOR "," ) AS display FROM product_characteristics');
                const _design = yield knex.raw('SELECT GROUP_CONCAT(DISTINCT design ORDER BY design ASC SEPARATOR "," ) AS design FROM product_characteristics');
                // удаляем пробелы в начале строки, делаем первую букву большой
                const format = (s) => {
                    while (s.charAt(0) === ' ') {
                        return s.substring(1).charAt(0).toLocaleUpperCase() + s.slice(2);
                    }
                    return s.charAt(0).toLocaleUpperCase() + s.slice(1);
                };
                info.purpose = _purpose[0][0].purpose
                    .split(',')
                    .map((s) => format(s))
                    .filter((s) => s !== 'null');
                info.connectionType = _connectionType[0][0].connectionType
                    .split(',')
                    .map((s) => format(s))
                    .filter((s) => s !== 'null');
                info.display = _display[0][0].display
                    .split(',')
                    .map((s) => format(s))
                    .filter((s) => s !== 'null');
                info.design = _design[0][0].design
                    .split(',')
                    .map((s) => format(s))
                    .filter((s) => s !== 'null');
                return info;
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
                    return { message: "Can't find this product" };
                }
                // Remove product folder with images from server
                (0, remove_photo_util_1.removePhoto)('', `products/${(0, replace_spaces_util_1.replaceSpaces)(product.name)}`);
                const deletedProducts = yield product_model_1.default.query().deleteById(productId);
                yield product_characteristics_model_1.default.query().deleteById(product.characteristicsId);
                yield favorite_model_1.default.query().delete().where({ productId });
                return deletedProducts;
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
    static deleteImage(productId, imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield product_model_1.default.query().findById(productId);
                if (!product) {
                    return { message: "Can't find this product" };
                }
                const image = yield image_module_1.default.query().findById(imageId);
                if (!image) {
                    return { message: "Can't find this image" };
                }
                // Remove product image from server folder
                (0, remove_photo_util_1.removePhoto)(image.src, `products/${(0, replace_spaces_util_1.replaceSpaces)(product.name)}`);
                const deletedImages = yield image_module_1.default.query().deleteById(imageId);
                return deletedImages;
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
    static addImage(productId, files) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let insertedImages = [];
                let images;
                const product = yield product_model_1.default.query().findById(productId);
                if (Array.isArray(files)) {
                    images = Array.from(files);
                }
                else {
                    images = Array.from(files[0]);
                }
                images.forEach((image) => __awaiter(this, void 0, void 0, function* () {
                    const src = `http://localhost:${process.env.PORT}/static/products/${(0, replace_spaces_util_1.replaceSpaces)(product.name)}/${image.filename}`;
                    const insertedImage = yield image_module_1.default.query().insert({
                        productId,
                        src,
                    });
                    insertedImages.push(insertedImage);
                }));
                return insertedImages;
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
                return product_model_1.default.query()
                    .insert({
                    name: product.name,
                    price: +product.price,
                    image: product.image,
                    categoryId: +product.categoryId,
                    characteristicsId: +characteristics.id,
                })
                    .withGraphFetched('[category(selectNameIdParent), characteristics, images(selectIdAndSrc)]');
            }
            catch (error) {
                console.log('Error: ', error);
                (0, remove_photo_util_1.removePhoto)(product.image, `products/${(0, replace_spaces_util_1.replaceSpaces)(product.name)}`);
                return null;
            }
        });
    }
    static updateProduct(productId, changingValues) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oldProduct = yield product_model_1.default.query().select().findById(productId);
                if (!oldProduct) {
                    throw new Error("Can't find this product");
                }
                // filtering null values
                Object.keys(changingValues).forEach((key) => {
                    if (changingValues[key] === null) {
                        delete changingValues[key];
                    }
                });
                if (changingValues.image) {
                    // Remove old image
                    (0, remove_photo_util_1.removePhoto)(oldProduct.image, `products/${(0, replace_spaces_util_1.replaceSpaces)(oldProduct.name)}`);
                }
                // достаем значения для продукта и для характеристик отдельно
                const { price, categoryId, name, image } = changingValues, characteristics = __rest(changingValues
                // повторно для продукта, так как что-то из выше перечисленного может быть null
                , ["price", "categoryId", "name", "image"]);
                // повторно для продукта, так как что-то из выше перечисленного может быть null
                const { purpose, description, design, connectionType, microphone, batteryLiveTime, display } = changingValues, productValues = __rest(changingValues, ["purpose", "description", "design", "connectionType", "microphone", "batteryLiveTime", "display"]);
                yield product_characteristics_model_1.default.query().patchAndFetchById(productId, characteristics);
                const product = yield product_model_1.default.query()
                    .patchAndFetchById(productId, productValues)
                    .withGraphFetched('[category(selectNameIdParent), characteristics, images(selectIdAndSrc)]');
                return product;
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