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
class UsersController {
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
            const users = yield users_service_1.default.deleteUser(+id);
            if (!users) {
                return next(ApiError_1.default.badRequest(`Deletion users error`));
            }
            return res.json(users);
        });
    }
    static changeRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, role } = req.query;
            if (!id) {
                next(ApiError_1.default.badRequest("User id hasn't typed"));
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
            try {
                const { id } = req.user;
                const photo = req.file.filename;
                const changingValues = req.body;
                if (changingValues.phone) {
                    changingValues.phone = +changingValues.phone;
                }
                if (photo !== null && photo !== undefined) {
                    changingValues.photo = `http://localhost:${process.env.PORT}/static/users/${photo}`;
                }
                if (changingValues.password !== null &&
                    changingValues.password !== undefined) {
                    // хэшируем пароль
                    const hashPassword = yield bcrypt_1.default.hash(changingValues.password, 3);
                    changingValues.password = hashPassword;
                }
                if (!id) {
                    next(ApiError_1.default.unAuthorizedError());
                }
                const user = yield users_service_1.default.editProfile(id, changingValues);
                if (!user) {
                    return next(ApiError_1.default.badRequest(`Editing profile error`));
                }
                return res
                    .status(200)
                    .json({ message: 'Profile data changed successfully ' });
            }
            catch (error) {
                console.log('Error: ', error);
                return res.status(500).json({ message: 'Error: ', error });
            }
        });
    }
    static getMyComments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            if (!id) {
                return next(ApiError_1.default.unAuthorizedError());
            }
            const comments = yield users_service_1.default.getComments(+id);
            if (!comments) {
                return next(ApiError_1.default.badRequest(`Fetching comments error`));
            }
            return res.json(comments);
        });
    }
    static getMyFavorites(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            if (!id) {
                return next(ApiError_1.default.unAuthorizedError());
            }
            const favorites = yield users_service_1.default.getFavorites(+id);
            if (!favorites) {
                return next(ApiError_1.default.badRequest(`Fetching favorites error`));
            }
            return res.json(favorites);
        });
    }
}
exports.default = UsersController;
//# sourceMappingURL=users.controller.js.map