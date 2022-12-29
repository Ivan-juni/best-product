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
const bcrypt_1 = __importDefault(require("bcrypt"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const users_service_1 = __importDefault(require("../services/users.service"));
const user_model_1 = __importDefault(require("../db/models/user.model"));
const schemas_1 = require("./types/schemas");
class UsersController {
    static getUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            // проверку на введенный id не делаем, так как есть другой метод getUsers, который просто вернет всех пользователей, если не ввести id
            const users = yield users_service_1.default.getUserById(+id);
            if (!users) {
                return next(ApiError_1.default.badRequest(`Fetching users error`));
            }
            return res.json(users);
        });
    }
    static getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield users_service_1.default.getUsers(req.query);
            if (!users) {
                return next(ApiError_1.default.badRequest(`Fetching users error`));
            }
            return res.json(users);
        });
    }
    static deleteUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            if (!id) {
                next(ApiError_1.default.badRequest("User id hasn't typed"));
            }
            if (+id === req.user.id) {
                next(ApiError_1.default.badRequest("You can't delete yourself"));
            }
            const user = yield user_model_1.default.query().findById(+id);
            if (!user) {
                next(ApiError_1.default.internal("Can't find this user"));
            }
            const result = yield users_service_1.default.deleteUser(+id, user.photo);
            if (!result) {
                return next(ApiError_1.default.badRequest(`Deletion users error`));
            }
            else {
                return res.json({ message: `Successfully deleted ${result} users` });
            }
        });
    }
    static changeRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, role } = req.query;
            if (!id) {
                next(ApiError_1.default.badRequest("User id hasn't typed"));
            }
            if (+id === req.user.id) {
                next(ApiError_1.default.badRequest("You can't change your role"));
            }
            const oldUser = yield user_model_1.default.query().findById(+id);
            if (!oldUser) {
                next(ApiError_1.default.internal("Can't find this user"));
            }
            const user = yield users_service_1.default.changeRole(+id, role.toString());
            if (!user) {
                return next(ApiError_1.default.badRequest(`Updating role error`));
            }
            return res.json(user);
        });
    }
    static editProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            const photo = req.file !== undefined ? req.file.filename : null;
            const changingValues = req.body;
            if (photo !== null && photo !== undefined) {
                changingValues.photo = `http://localhost:${process.env.PORT}/static/users/${photo}`;
            }
            if (changingValues.password !== null && changingValues.password !== undefined) {
                // хэшируем пароль
                const hashPassword = yield bcrypt_1.default.hash(changingValues.password, 3);
                changingValues.password = hashPassword;
            }
            const oldUser = yield user_model_1.default.query().select().findById(id);
            if (!oldUser) {
                next(ApiError_1.default.internal("Can't find this user"));
            }
            yield schemas_1.editProfileSchema.validate(Object.assign(Object.assign({}, changingValues), { photo }));
            const user = yield users_service_1.default.editProfile(id, oldUser.photo, {
                photo: changingValues.photo,
                password: changingValues.password,
                phone: +changingValues.phone || null,
                email: changingValues.email,
                firstName: changingValues.firstName,
                lastName: changingValues.lastName,
            });
            if (!user) {
                return next(ApiError_1.default.badRequest(`Editing profile error`));
            }
            return res.status(200).json(user);
        });
    }
}
exports.default = UsersController;
//# sourceMappingURL=users.controller.js.map