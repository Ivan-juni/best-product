"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const yup = __importStar(require("yup"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../db/models/user/user.model"));
const auth_service_1 = __importDefault(require("../services/auth.service"));
const registrationSchema = yup.object({
    email: yup.string().email().required(),
    phone: yup.number().nullable(),
    password: yup
        .string()
        .min(4, 'Password should be longer than 3 symbols')
        .max(30, 'Password should be shorter than 30 symbols')
        .matches(/^[a-zA-Z0-9-]+$/, 'Only English letters and numbers')
        .required(),
    firstName: yup.string().max(255, 'Firstname should be shorter than 255 symbols').required(),
    lastName: yup.string().max(255, 'Lastname should be shorter than 255 symbols').required(),
    role: yup.string().nullable().default('USER').min(4).max(5),
    photo: yup.string().nullable().default(null),
    createdAt: yup.date(),
    updatedAt: yup.date(),
});
class AuthController {
    static registration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield registrationSchema.validate(req.body);
            }
            catch (err) {
                return next(ApiError_1.default.internal(`Validation error: ${err.message}`));
            }
            // достаем введенные пользователем данные
            const { email } = req.body;
            // проверяем есть ли такой пользователь в базе
            const candidate = yield user_model_1.default.query().findOne({ email });
            if (candidate !== undefined) {
                return next(ApiError_1.default.badRequest(`User with the e-mail ${email} already exists`));
            }
            //
            const userData = yield auth_service_1.default.registration(req.body);
            if (!userData) {
                return next(ApiError_1.default.badRequest(`Registration error`));
            }
            // храним refreshToken в куках
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true, // чтобы нельзя было получить/изменить внутри браузера
            });
            return res.json(userData);
        });
    }
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield user_model_1.default.query().findOne({ email });
            if (user == undefined) {
                return next(ApiError_1.default.badRequest(`User with the e-mail ${email} doesn't exist`));
            }
            // сравниваем введенный пароль с захэшированным в базе данных
            const isPassEquals = yield bcrypt_1.default.compare(password, user.password);
            if (!isPassEquals) {
                return next(ApiError_1.default.badRequest(`Incorrect password`));
            }
            const userData = yield auth_service_1.default.login(email);
            if (!userData) {
                return next(ApiError_1.default.badRequest(`Login error`));
            }
            // храним refreshToken в куках
            if (req.body.remember && req.body.remember !== undefined) {
                res.cookie('refreshToken', userData.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true, // чтобы нельзя было получить/изменить внутри браузера
                });
            }
            else {
                res.cookie('refreshToken', userData.refreshToken, {
                    maxAge: 3 * 60 * 1000,
                    httpOnly: true,
                });
            }
            return res.json(userData);
        });
    }
    static logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // достаем из кукис refreshToken
            const { refreshToken } = req.cookies;
            const token = yield auth_service_1.default.logout(refreshToken);
            if (!token) {
                return next(ApiError_1.default.badRequest(`Logout error`));
            }
            // удаляем refreshToken из кукис
            res.clearCookie('refreshToken');
            if (token === 1) {
                return res.json({ message: 'Logout successfully' });
            }
            else {
                return res.json({ message: 'Sth goes wrong...' });
            }
        });
    }
    static refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // достаем из кукис refreshToken
            const { refreshToken } = req.cookies;
            // если токена нет в куках, пользователь не авторизован
            if (!refreshToken) {
                return next(ApiError_1.default.unAuthorizedError());
            }
            // обновляем refreshToken
            const userData = yield auth_service_1.default.refresh(refreshToken);
            if (!userData) {
                return next(ApiError_1.default.badRequest(`Refresh token error`));
            }
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.json(userData);
        });
    }
}
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map