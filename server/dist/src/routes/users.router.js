"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controller_1 = __importDefault(require("../controllers/users.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const check_role_middleware_1 = __importDefault(require("../middlewares/check-role.middleware"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.default)();
// Where store download files
const storage = multer_1.default.diskStorage({
    destination: './assets/users/',
    filename: (req, file, callback) => {
        callback(null, path_1.default.parse(file.originalname).name +
            '-' +
            Date.now() +
            path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
// @route put /api/users/changePassword
// @des Change user role
router.put('/editProfile', auth_middleware_1.default, upload.single('image'), users_controller_1.default.editProfile);
// @route get /api/users/comments
// @des Get user's comments
router.get('/comments', auth_middleware_1.default, users_controller_1.default.getMyComments);
// @route get /api/users/favorites
// @des Get user's favorites
router.get('/favorites', auth_middleware_1.default, users_controller_1.default.getMyFavorites);
// ! Admin panel
// @route get /api/users || /api/users?id=
// @des Get users
router.get('/', (0, check_role_middleware_1.default)('ADMIN'), users_controller_1.default.getUsers);
// @route delete /api/users?id=
// @des Delete user by id
router.delete('/', (0, check_role_middleware_1.default)('ADMIN'), users_controller_1.default.deleteUsers);
// @route put /api/users/changeRole?id=3&role=ADMIN
// @des Change user role
router.put('/changeRole', (0, check_role_middleware_1.default)('ADMIN'), users_controller_1.default.changeRole);
exports.default = router;
//# sourceMappingURL=users.router.js.map