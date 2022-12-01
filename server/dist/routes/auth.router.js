"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = (0, express_1.default)();
router.post('/registration', auth_controller_1.default.registration);
router.post('/login', auth_controller_1.default.login);
router.post('/logout', auth_middleware_1.default, auth_controller_1.default.logout);
router.get('/refresh', auth_controller_1.default.refresh);
exports.default = router;
//# sourceMappingURL=auth.router.js.map