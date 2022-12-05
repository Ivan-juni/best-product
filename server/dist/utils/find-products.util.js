"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProducts = exports.findInRange = exports.searchUtil = void 0;
const searchUtil = (qb, searchCriteria, parametr) => {
    const array = searchCriteria[parametr].split(',');
    qb.andWhere(`product_characteristics.${parametr}`, 'like', `%${array[0]}%`);
    for (let index = 1; index < array.length; index++) {
        const item = array[index];
        qb.orWhere(`product_characteristics.${parametr}`, 'like', `%${item}%`);
    }
};
exports.searchUtil = searchUtil;
const findInRange = (qb, parametr, searchCriteria) => {
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
exports.findInRange = findInRange;
const findProducts = (qb, searchCriteria) => {
    if (searchCriteria.id) {
        qb.andWhere('products.id', '=', +searchCriteria.id);
    }
    if (searchCriteria.name) {
        qb.andWhere('products.name', 'like', `%${searchCriteria.name}%`);
    }
    if (searchCriteria.purpose) {
        (0, exports.searchUtil)(qb, searchCriteria, 'purpose');
    }
    if (searchCriteria.display) {
        (0, exports.searchUtil)(qb, searchCriteria, 'display');
    }
    if (searchCriteria.connectionType) {
        (0, exports.searchUtil)(qb, searchCriteria, 'connectionType');
    }
    if (searchCriteria.microphone && searchCriteria.microphone === 'true') {
        const microphone = true;
        qb.andWhere('product_characteristics.microphone', '=', microphone);
    }
    if (searchCriteria.price) {
        (0, exports.findInRange)(qb, 'price', searchCriteria);
    }
    if (searchCriteria.views) {
        (0, exports.findInRange)(qb, 'views', searchCriteria);
    }
    if (searchCriteria.likes) {
        (0, exports.findInRange)(qb, 'likes', searchCriteria);
    }
    if (searchCriteria.dislikes) {
        (0, exports.findInRange)(qb, 'dislikes', searchCriteria);
    }
    if (searchCriteria.favoriteStars) {
        (0, exports.findInRange)(qb, 'favoriteStars', searchCriteria);
    }
};
exports.findProducts = findProducts;
//# sourceMappingURL=find-products.util.js.map