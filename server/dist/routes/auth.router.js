"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const async_handler_middleware_1 = __importDefault(require("../middlewares/async-handler.middleware"));
const router = (0, express_1.default)();
router.post('/registration', (0, async_handler_middleware_1.default)(auth_controller_1.default.registration));
router.post('/login', (0, async_handler_middleware_1.default)(auth_controller_1.default.login));
router.get('/refresh', (0, async_handler_middleware_1.default)(auth_controller_1.default.refresh));
router.use(auth_middleware_1.default);
router.post('/logout', (0, async_handler_middleware_1.default)(auth_controller_1.default.logout));
exports.default = router;
//# sourceMappingURL=auth.router.js.map