"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_router_1 = __importDefault(require("./auth.router"));
const products_router_1 = __importDefault(require("./products.router"));
const users_router_1 = __importDefault(require("./users.router"));
const router = express_1.default.Router();
router.use('/auth', auth_router_1.default);
router.use('/products', products_router_1.default);
router.use('/users', users_router_1.default);
exports.default = router;
//# sourceMappingURL=router.js.map