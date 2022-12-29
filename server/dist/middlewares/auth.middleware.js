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
const token_service_1 = __importDefault(require("../services/token.service"));
function default_1(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                return next(ApiError_1.default.unAuthorizedError());
            }
            const accessToken = authorizationHeader.split(' ')[1];
            if (!accessToken) {
                return next(ApiError_1.default.unAuthorizedError());
            }
            const userData = yield token_service_1.default.validateAccessToken(accessToken);
            if (!userData) {
                return next(ApiError_1.default.unAuthorizedError());
            }
            const { id } = userData;
            if (!id) {
                return next(ApiError_1.default.unAuthorizedError());
            }
            req.user = userData;
            next();
        }
        catch (error) {
            return next(ApiError_1.default.unAuthorizedError());
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=auth.middleware.js.map