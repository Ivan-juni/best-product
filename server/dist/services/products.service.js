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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_model_1 = __importDefault(require("../db/models/product/product.model"));
class ProductService {
    static getProducts(searchCriteria) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = +searchCriteria.limit || 5;
            const page = +searchCriteria.page || 0;
            try {
                const products = yield product_model_1.default.query()
                    .select()
                    .where((qb) => {
                    if (searchCriteria.id) {
                        qb.where('products.id', '=', +searchCriteria.id);
                    }
                })
                    .page(page, limit);
                return products.results;
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
}
exports.default = ProductService;
//# sourceMappingURL=products.service.js.map