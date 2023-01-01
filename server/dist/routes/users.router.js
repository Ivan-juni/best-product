"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUsersRoutes = void 0;
const express_1 = require("express");
const users_controller_1 = __importDefault(require("../controllers/users.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const async_handler_middleware_1 = __importDefault(require("../middlewares/async-handler.middleware"));
const check_role_middleware_1 = __importDefault(require("../middlewares/check-role.middleware"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const enums_1 = require("../controllers/types/enums");
function createUsersRoutes() {
    const router = (0, express_1.Router)();
    // Where store download files
    const storage = multer_1.default.diskStorage({
        destination: './assets/users/',
        filename: (req, file, callback) => {
            callback(null, path_1.default.parse(file.originalname).name + '-' + Date.now() + path_1.default.extname(file.originalname));
        },
    });
    const upload = (0, multer_1.default)({ storage });
    router.use(auth_middleware_1.default);
    router.patch('/editProfile', upload.single('image'), (0, async_handler_middleware_1.default)(users_controller_1.default.editProfile));
    // ! Admin panel
    router.use((0, check_role_middleware_1.default)(enums_1.ROLES.ADMIN));
    router.get('/', (0, async_handler_middleware_1.default)(users_controller_1.default.getUsers));
    router.get('/:id', (0, async_handler_middleware_1.default)(users_controller_1.default.getUserById));
    router.delete('/', (0, async_handler_middleware_1.default)(users_controller_1.default.deleteUsers));
    // ?id=3&role=ADMIN
    router.patch('/changeRole', (0, async_handler_middleware_1.default)(users_controller_1.default.changeRole));
    return router;
}
exports.createUsersRoutes = createUsersRoutes;
//# sourceMappingURL=users.router.js.map