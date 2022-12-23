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
        // Deletes ALL existing entries
        // await knex('product_characteristics').del()
        yield knex('images').del();
        yield knex('products').del();
        yield knex('categories').del();
        // Inserts seed entries
        yield knex('categories').insert([
            { parent: 0, name: 'Electronics' },
            { parent: 1, name: 'Accessories' },
            { parent: 1, name: 'Laptops' },
            { parent: 1, name: 'Tablets' },
            { parent: 1, name: 'TV' },
            { parent: 2, name: 'Headphones' },
            { parent: 1, name: 'Smartphones' },
            { parent: 2, name: 'Car Accessories' },
        ]);
    });
}
exports.seed = seed;
//# sourceMappingURL=2_add_categories.js.map