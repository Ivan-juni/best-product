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
const user_model_1 = __importDefault(require("../db/models/user/user.model"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class UserService {
    static getUsers(searchCriteria) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = +searchCriteria.limit || 5;
            const page = +searchCriteria.page || 0;
            try {
                const users = yield user_model_1.default.query()
                    .select()
                    .where((qb) => {
                    if (searchCriteria.id) {
                        qb.where('users.id', '=', +searchCriteria.id);
                    }
                })
                    .page(page, limit);
                return users.results;
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
    static deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return user_model_1.default.query().deleteById(id);
            }
            catch (error) {
                return null;
            }
        });
    }
    static changeRole(id, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return user_model_1.default.query().patchAndFetchById(id, { role: role });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    static editProfile(id, changingValues) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oldUser = yield user_model_1.default.query().select().findById(id);
                if (!oldUser) {
                    return { message: "Can't find this user" };
                }
                // Remove old photo
                if (oldUser.photo) {
                    const oldPath = path_1.default.join(__dirname, '..', '..', 'assets', 'users', path_1.default.basename(oldUser.photo));
                    if (fs_1.default.existsSync(oldPath)) {
                        fs_1.default.unlink(oldPath, (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                        });
                    }
                }
                // filtering null values
                Object.keys(changingValues).forEach((key) => {
                    if (changingValues[key] === null) {
                        delete changingValues[key];
                    }
                });
                return user_model_1.default.query().patchAndFetchById(id, changingValues);
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=users.service.js.map