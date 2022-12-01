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
        yield knex('products').del();
        // Inserts seed entries
        yield knex('products').insert([
            {
                name: 'JBL T110',
                price: 800,
                image: 'http://localhost:8000/static/products/jblt110.png',
                categoryId: 6,
                characteristicsId: 1,
            },
            {
                name: 'Samsung Smart TV 40',
                price: 1300,
                image: 'http://localhost:8000/static/products/SamsungSmartTV40.png',
                categoryId: 5,
                characteristicsId: 2,
            },
            {
                name: 'MacBook Pro M2 2022',
                price: 1700,
                image: 'http://localhost:8000/static/products/MacBookProM22022.jpeg',
                categoryId: 3,
                characteristicsId: 3,
            },
            {
                name: 'Apple Iphone 11',
                price: 600,
                image: 'http://localhost:8000/static/products/AppleIphone11.jpeg',
                categoryId: 7,
                characteristicsId: 4,
            },
            {
                name: 'USB Converter',
                price: 600,
                image: 'http://localhost:8000/static/products/USBConverter.jpeg',
                categoryId: 8,
                characteristicsId: 5,
            },
        ]);
    });
}
exports.seed = seed;
//# sourceMappingURL=add_products.js.map