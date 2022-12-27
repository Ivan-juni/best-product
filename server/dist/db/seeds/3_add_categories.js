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
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
function seed(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        // Inserts seed entries
        // 'id' добавляю, так в таблице `products` указываются id категорий. Иначе при повторном seed'е id категорий слетят (будет 9-16)
        // аналогично и с другими таблицами
        yield knex('categories').insert([
            { id: 1, parent: 0, name: 'Electronics' },
            { id: 2, parent: 1, name: 'Accessories' },
            { id: 3, parent: 1, name: 'Laptops' },
            { id: 4, parent: 1, name: 'Tablets' },
            { id: 5, parent: 1, name: 'TV' },
            { id: 6, parent: 2, name: 'Headphones' },
            { id: 7, parent: 1, name: 'Smartphones' },
            { id: 8, parent: 2, name: 'Car Accessories' },
        ]);
    });
}
exports.seed = seed;
//# sourceMappingURL=3_add_categories.js.map