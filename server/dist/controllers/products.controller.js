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
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const products_service_1 = __importDefault(require("../services/products.service"));
class ProductsController {
    static getProducts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield products_service_1.default.getProducts(req.query);
            if (!products) {
                return next(ApiError_1.default.badRequest(`Fetching products error`));
            }
            return res.json(products);
        });
    }
}
exports.default = ProductsController;
//# sourceMappingURL=products.controller.js.map