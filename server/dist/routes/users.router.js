"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controller_1 = __importDefault(require("../controllers/users.controller"));
const check_role_middleware_1 = __importDefault(require("../middlewares/check-role.middleware"));
const router = (0, express_1.default)();
// ! Admin panel
// @route get /api/users || /api/users?id=
// @des Get users
router.get('/', (0, check_role_middleware_1.default)('ADMIN'), users_controller_1.default.getUsers);
// @route get /api/users?id=
// @des Delete user by id
router.delete('/', (0, check_role_middleware_1.default)('ADMIN'), users_controller_1.default.deleteUsers);
// @route get /api/users/changeRole?id=3&role=ADMIN
// @des Change user role
router.put('/changeRole', (0, check_role_middleware_1.default)('ADMIN'), users_controller_1.default.changeRole);
exports.default = router;
//# sourceMappingURL=users.router.js.map