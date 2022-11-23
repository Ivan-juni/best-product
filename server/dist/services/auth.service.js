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
const token_service_1 = __importDefault(require("./token.service"));
const user_dto_1 = __importDefault(require("../dtos/user-dto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthService {
    static registration({ email, password, firstName, lastName, createdAt, updatedAt, phone, photo, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // хэшируем пароль
                const hashPassword = yield bcrypt_1.default.hash(password, 3);
                // создаем пользователя
                const user = yield user_model_1.default.query().insert({
                    email,
                    password: hashPassword,
                    firstName,
                    lastName,
                    // role,
                    phone,
                    photo,
                    createdAt,
                    updatedAt,
                });
                // создаем модель пользователя, чтобы передать в generateTokens
                // туда нельзя передавать пароль и другую постороннюю ин-цию,
                // поэтому мы создаем  data transfer object (dto) c email, id, role
                const userDto = new user_dto_1.default(user); // id, email, phone, firstName, lastName, role, photo
                // генерируем пару токенов для пользователя
                const tokens = yield token_service_1.default.generateTokens(Object.assign({}, userDto));
                // сохраняем refreshToken для пользователя в бд
                yield token_service_1.default.saveToken(userDto.id, tokens.refreshToken);
                // объект - accessToken, refreshToken + user: id, email, phone, firstName, lastName, role, photo
                return Object.assign(Object.assign({}, tokens), { user: userDto });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    static login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.query().findOne({ email });
                const userDto = new user_dto_1.default(user); // id, email, phone, firstName, lastName, role, photo
                const tokens = yield token_service_1.default.generateTokens(Object.assign({}, userDto));
                yield token_service_1.default.saveToken(userDto.id, tokens.refreshToken);
                return Object.assign(Object.assign({}, tokens), { user: userDto });
            }
            catch (error) {
                return null;
            }
        });
    }
    static logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            // удаляем refreshToken из бд
            try {
                return token_service_1.default.removeToken(refreshToken);
            }
            catch (error) {
                return null;
            }
        });
    }
    static refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // валидируем токен (не подделан и годен)
                const userData = yield token_service_1.default.validateRefreshToken(refreshToken);
                // ищем токен в бд
                const tokenFromDb = yield token_service_1.default.findToken(refreshToken);
                if (!userData || !tokenFromDb) {
                    return null;
                }
                // получаем пользователя из бд (вдруг за это время
                // ин-ция про него изменилась и нужно зашить в токен новую)
                const user = yield user_model_1.default.query().findOne({ id: userData.id });
                const userDto = new user_dto_1.default(user); // id, email, phone, firstName, lastName, role, photo
                // генерируем свежую пару токенов для пользователя
                const tokens = yield token_service_1.default.generateTokens(Object.assign({}, userDto));
                // сохраняем refreshToken пользователя в бд
                yield token_service_1.default.saveToken(userDto.id, tokens.refreshToken);
                return Object.assign(Object.assign({}, tokens), { user: userDto });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
}
exports.default = AuthService;
//# sourceMappingURL=auth.service.js.map