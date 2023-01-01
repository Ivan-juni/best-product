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
const comment_model_1 = __importDefault(require("../db/models/comment.model"));
const product_model_1 = __importDefault(require("../db/models/product.model"));
const schemas_1 = require("./types/schemas");
const enums_1 = require("./types/enums");
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
            const product = yield product_model_1.default.query().findById(+productId);
            if (!product) {
                return next(ApiError_1.default.internal("Can't find this product"));
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
            const product = yield product_model_1.default.query().findById(+productId);
            if (!product) {
                return next(ApiError_1.default.internal("Can't find this product"));
            }
            yield schemas_1.commentSchema.validate({ commentText });
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
            if (role === enums_1.ROLES.ADMIN) {
                const comment = yield comment_model_1.default.query().findOne({ id: +commentId });
                if (!comment) {
                    return next(ApiError_1.default.internal("Can't find or delete this comment"));
                }
            }
            else if (role === enums_1.ROLES.USER) {
                const comment = yield comment_model_1.default.query().findOne({ id: +commentId, userId: id });
                if (!comment) {
                    return next(ApiError_1.default.internal("Can't find or delete this comment"));
                }
            }
            const result = yield comments_service_1.default.deleteComment(+id, +commentId, role);
            if (!result) {
                return next(ApiError_1.default.badRequest(`Deletion comment error`));
            }
            else {
                return res.json({ message: `Successfully deleted ${result} comments` });
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
            const oldComment = yield comment_model_1.default.query().findOne({ userId: id, id: +commentId });
            if (!oldComment) {
                return next(ApiError_1.default.internal("Can't find this comment"));
            }
            yield schemas_1.commentSchema.validate({ commentText });
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