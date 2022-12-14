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
        yield knex('images').insert([
            { productId: 1, src: 'http://localhost:8000/static/products/JBL_T450/jbl_t450_white-1671010577802.jpeg' },
            { productId: 1, src: 'http://localhost:8000/static/products/JBL_T450/jblt450blue.jpeg' },
            { productId: 1, src: 'http://localhost:8000/static/products/JBL_T450/jblt450blue.jpeg' },
        ]);
    });
}
exports.seed = seed;
//# sourceMappingURL=6_add_images.js.map