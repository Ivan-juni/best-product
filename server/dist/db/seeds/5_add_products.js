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
        yield knex('products').insert([
            {
                id: 1,
                name: 'JBL T450',
                price: 800,
                image: 'http://localhost:8000/static/products/JBL_T450/jblt450large-1671010055765.jpeg',
                categoryId: 6,
                characteristicsId: 1,
            },
            {
                id: 2,
                name: 'Samsung Smart TV 40',
                price: 1300,
                image: 'http://localhost:8000/static/products/Samsung_Smart_TV_40/SamsungSmartTV40.png',
                categoryId: 5,
                characteristicsId: 2,
            },
            {
                id: 3,
                name: 'MacBook Pro M2 2022',
                price: 1700,
                image: 'http://localhost:8000/static/products/MacBook_Pro_M2_2022/MacBookProM22022.jpeg',
                categoryId: 3,
                characteristicsId: 3,
            },
            {
                id: 4,
                name: 'Apple Iphone 11',
                price: 600,
                image: 'http://localhost:8000/static/products/Apple_Iphone_11/AppleIphone11.jpeg',
                categoryId: 7,
                characteristicsId: 4,
            },
            {
                id: 5,
                name: 'USB Converter',
                price: 600,
                image: 'http://localhost:8000/static/products/USB_Converter/UsbCarConverter-1670584132912.png',
                categoryId: 8,
                characteristicsId: 5,
            },
        ]);
    });
}
exports.seed = seed;
//# sourceMappingURL=5_add_products.js.map