"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProducts = void 0;
const find_in_range_util_1 = require("./find-in-range.util");
const findProducts = (qb, searchCriteria) => {
    if (searchCriteria.id) {
        qb.andWhere('products.id', '=', +searchCriteria.id);
    }
    if (searchCriteria.name) {
        qb.andWhere('products.name', 'like', `%${searchCriteria.name}%`);
    }
    if (searchCriteria.purpose) {
        const purposes = searchCriteria.purpose.split(',');
        purposes.forEach((purpose) => {
            qb.andWhere('product_characteristics.purpose', 'like', `%${purpose}%`);
        });
    }
    if (searchCriteria.display) {
        const displays = searchCriteria.display.split(',');
        displays.forEach((display) => {
            qb.andWhere('product_characteristics.display', 'like', `%${display}%`);
        });
    }
    if (searchCriteria.connectionType) {
        const connectionTypes = searchCriteria.connectionType.split(',');
        connectionTypes.forEach((connectionType) => {
            qb.andWhere('product_characteristics.connectionType', 'like', `%${connectionType}%`);
        });
    }
    if (searchCriteria.microphone && searchCriteria.microphone === 'true') {
        const microphone = true;
        qb.andWhere('product_characteristics.microphone', '=', microphone);
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
};
exports.findProducts = findProducts;
//# sourceMappingURL=find-products.util.js.map