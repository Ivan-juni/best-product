"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatString = void 0;
const formatString = (str) => {
    // удаляем пробелы в начале строки (так как в одной ячейке может быть несколько значений), делаем первую букву большой
    const format = (s) => {
        while (s.charAt(0) === ' ') {
            return s.substring(1).charAt(0).toLocaleUpperCase() + s.slice(2);
        }
        return s.charAt(0).toLocaleUpperCase() + s.slice(1);
    };
    return str
        .split(',')
        .map((s) => format(s))
        .filter((s) => s !== 'null' && s !== 'Null');
};
exports.formatString = formatString;
//# sourceMappingURL=format-string.util.js.map