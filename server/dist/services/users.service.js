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
const user_model_1 = __importDefault(require("../db/models/user.model"));
const remove_photo_util_1 = require("../utils/remove-photo.util");
const comment_model_1 = __importDefault(require("../db/models/comment.model"));
const favorite_model_1 = __importDefault(require("../db/models/favorite.model"));
class UserService {
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.query().findById(id);
        });
    }
    static getUsers(searchCriteria) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = +searchCriteria.limit || 5;
            const page = +searchCriteria.page || 0;
            return user_model_1.default.query()
                .select('id', 'email', 'phone', 'photo', 'firstName', 'lastName', 'role', 'createdAt', 'updatedAt')
                .where((qb) => {
                if (searchCriteria.id) {
                    qb.where('users.id', '=', +searchCriteria.id);
                }
                if (searchCriteria.firstName) {
                    qb.orWhere('users.firstName', 'like', `%${searchCriteria.firstName}%`);
                }
            })
                .page(page, limit);
        });
    }
    static deleteUser(id, src) {
        return __awaiter(this, void 0, void 0, function* () {
            yield comment_model_1.default.query().delete().where({ userId: id });
            yield favorite_model_1.default.query().delete().where({ userId: id });
            const deletedUser = yield user_model_1.default.query().deleteById(id);
            // Remove photo
            (0, remove_photo_util_1.removePhoto)(src, 'users');
            return deletedUser;
        });
    }
    static changeRole(id, role) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.query().patchAndFetchById(id, { role: role });
        });
    }
    static editProfile(id, src, changingValues) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // filtering null values
                Object.keys(changingValues).forEach((key) => {
                    if (changingValues[key] === null) {
                        delete changingValues[key];
                    }
                });
                const user = yield user_model_1.default.query().patchAndFetchById(id, changingValues);
                if (changingValues.photo) {
                    // Remove old photo
                    (0, remove_photo_util_1.removePhoto)(src, 'users');
                }
                return user;
            }
            catch (error) {
                console.log('Error: ', error);
                if (changingValues.photo) {
                    (0, remove_photo_util_1.removePhoto)(changingValues.photo, 'users');
                }
            }
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=users.service.js.map