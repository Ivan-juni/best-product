"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sort = void 0;
const sort = (searchCriteria, params // price, favoriteStars, date
) => {
    // sorting params
    const test = [];
    let order = 'asc';
    params.forEach((param) => {
        // сортировка
        // first letter to upper case
        const formatedParam = `orderBy${param.charAt(0).toLocaleUpperCase() + param.slice(1)}`;
        if (searchCriteria[formatedParam]) {
            // по возрастанию
            if (searchCriteria[formatedParam] === 'low') {
                order = 'asc';
            }
            // по убыванию
            if (searchCriteria[formatedParam] === 'high') {
                order = 'desc';
            }
            test.push({
                column: param,
                order: order,
            });
        }
    });
    if (test.length === 0) {
        test.push({
            column: 'id',
            order: 'asc',
        });
    }
    return test;
};
exports.sort = sort;
//# sourceMappingURL=order-by.util.js.map