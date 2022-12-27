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
const comments_service_1 = __importDefault(require("../services/comments.service"));
class CommentsController {
    // comments
    static getProductComments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.query;
            const page = +req.query.page || 0;
            const limit = +req.query.limit || 5;
            const orderByDate = req.query.orderByDate ? req.query.orderByDate.toString() : 'high';
            if (!productId) {
                return next(ApiError_1.default.internal('Type the product id'));
            }
            if (orderByDate !== 'low' && orderByDate !== 'high') {
                return next(ApiError_1.default.internal('Type the correct sort param (low or high)'));
            }
            const comments = yield comments_service_1.default.getProductComments(+productId, { orderByDate, page, limit });
            if (!comments) {
                return next(ApiError_1.default.badRequest(`Fetching comments error`));
            }
            return res.json(comments);
        });
    }
    static getUserComments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            if (!id) {
                return next(ApiError_1.default.unAuthorizedError());
            }
            const comments = yield comments_service_1.default.getComments(+id);
            if (!comments) {
                return next(ApiError_1.default.badRequest(`Fetching comments error`));
            }
            return res.json(comments);
        });
    }
    static addComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            const { productId } = req.query;
            const commentText = req.body.text;
            if (!productId) {
                return next(ApiError_1.default.internal('Type product id'));
            }
            if (!commentText) {
                return next(ApiError_1.default.internal('Please, type the cooment text'));
            }
            if (!id) {
                return next(ApiError_1.default.unAuthorizedError());
            }
            const comment = yield comments_service_1.default.addComment(+id, +productId, commentText);
            if (!comment) {
                return next(ApiError_1.default.badRequest(`Adding comment error`));
            }
            return res.json(comment);
        });
    }
    static deleteComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, role } = req.user;
            const { commentId } = req.query;
            if (!commentId) {
                return next(ApiError_1.default.internal('Type comment id'));
            }
            if (!id) {
                return next(ApiError_1.default.unAuthorizedError());
            }
            const result = yield comments_service_1.default.deleteComment(+id, +commentId, role);
            if (!result) {
                return next(ApiError_1.default.badRequest(`Deletion comment error`));
            }
            if (typeof result == 'number') {
                return res.json({ message: `Successfully deleted ${result} comments` });
            }
            else {
                return res.json(result);
            }
        });
    }
    static updateComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            const { commentId } = req.query;
            const commentText = req.body.text;
            if (!commentId) {
                return next(ApiError_1.default.internal('Please, type the comment id'));
            }
            if (!commentText) {
                return next(ApiError_1.default.internal('Please, type the comment text'));
            }
            if (!id) {
                return next(ApiError_1.default.unAuthorizedError());
            }
            const comment = yield comments_service_1.default.updateComment(+id, +commentId, commentText);
            if (!comment) {
                return next(ApiError_1.default.badRequest(`Updating comment error`));
            }
            return res.json(comment);
        });
    }
}
exports.default = CommentsController;
//# sourceMappingURL=comments.controller.js.map