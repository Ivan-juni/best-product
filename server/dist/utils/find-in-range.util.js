"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findInRange = void 0;
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
//# sourceMappingURL=find-in-range.util.js.map