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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class ProductService {
    static getProducts(searchCriteria) {
        return __awaiter(this, void 0, void 0, function* () {
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
            try {
                const products = yield product_model_1.default.query()
                    .select()
                    .from('products')
                    .where((qb) => __awaiter(this, void 0, void 0, function* () {
                    if (searchCriteria.id) {
                        qb.where('products.id', '=', +searchCriteria.id);
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
                    // if (searchCriteria.category) {
                    // }
                }))
                    .innerJoin('categories', 'categories.id', 'products.categoryId')
                    .page(page, limit);
                return products.results;
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
                // Remove old photo
                if (oldProduct.image) {
                    const oldPath = path_1.default.join(__dirname, '..', '..', 'assets', 'products', path_1.default.basename(oldProduct.image));
                    if (fs_1.default.existsSync(oldPath)) {
                        fs_1.default.unlink(oldPath, (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                        });
                    }
                }
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