"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sort = void 0;
const sort = (searchCriteria, params // price, favoriteStars
) => {
    // sorting params
    const sortParams = {
        column: 'id',
        order: 'asc',
    };
    // отсортирует по последнему заданному параметру
    params.forEach((param) => {
        // сортировка
        // first letter to upper case
        const formatedParam = `orderBy${param.charAt(0).toLocaleUpperCase() + param.slice(1)}`;
        if (searchCriteria[formatedParam]) {
            sortParams.column = param;
            // по возрастанию
            if (searchCriteria[formatedParam] === 'low') {
                sortParams.order = 'asc';
            }
            // по убыванию
            if (searchCriteria[formatedParam] === 'high') {
                sortParams.order = 'desc';
            }
        }
    });
    return sortParams;
};
exports.sort = sort;
//# sourceMappingURL=sort-by.util.js.map