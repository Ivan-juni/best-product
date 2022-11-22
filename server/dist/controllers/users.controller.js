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
const user_service_1 = __importDefault(require("../services/user.service"));
class UsersController {
    static getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield user_service_1.default.getUsers(req.query);
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
            const users = yield user_service_1.default.deleteUser(+id);
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
            const user = yield user_service_1.default.changeRole(+id, role.toString());
            if (!user) {
                return next(ApiError_1.default.badRequest(`Updating role error`));
            }
            return res.json(user);
        });
    }
}
exports.default = UsersController;
//# sourceMappingURL=users.controller.js.map