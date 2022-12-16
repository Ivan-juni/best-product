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
const comment_model_1 = __importDefault(require("../db/models/comment.model"));
const sort_by_util_1 = require("../utils/sort-by.util");
class CommentService {
    static getComments(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = yield comment_model_1.default.query()
                    .select('comments.id', 'comments.productId', 'products.name as productName', 'comments.text', 'comments.createdAt', 'comments.updatedAt')
                    .where({ userId })
                    .leftJoin('products', function () {
                    this.on('products.id', '=', 'comments.productId');
                });
                return comments;
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
    static addComment(userId, productId, text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield comment_model_1.default.query().insertAndFetch({
                    userId,
                    productId,
                    text,
                });
                return comment;
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
    static updateComment(userId, commentId, text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oldComment = yield comment_model_1.default.query().select().where({ userId, id: commentId });
                if (!oldComment) {
                    throw new Error("Can't find this comment");
                }
                const comment = yield comment_model_1.default.query().select().where({ userId, id: commentId }).patchAndFetch({
                    text,
                });
                return comment;
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
    static deleteComment(userId, commentId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (role === 'ADMIN') {
                    const comment = yield comment_model_1.default.query().findOne({ id: commentId });
                    if (!comment) {
                        return { message: "Can't find or delete this comment" };
                    }
                    return comment_model_1.default.query().delete().where({ id: commentId });
                }
                else if (role === 'USER') {
                    const comment = yield comment_model_1.default.query().findOne({ id: commentId, userId });
                    if (!comment) {
                        return { message: "Can't find or delete this comment" };
                    }
                    return comment_model_1.default.query().delete().where({ id: commentId, userId });
                }
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
    static getProductComments(productId, searchCriteria) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // параметры для сортировки
                const sortParams = (0, sort_by_util_1.sort)(searchCriteria, ['date']);
                const comments = yield comment_model_1.default.query()
                    .select('comments.id', 'comments.userId', 'users.email as userEmail', 'users.firstName as userFirstName', 'users.lastName as userLastName', 'users.photo as userPhoto', 'comments.text', 'comments.createdAt', 'comments.updatedAt')
                    .where({ productId })
                    .leftJoin('users', function () {
                    this.on('users.id', '=', 'comments.userId');
                })
                    .orderBy(`comments.createdAt`, sortParams.order)
                    .page(searchCriteria.page, searchCriteria.limit);
                return comments;
            }
            catch (error) {
                console.log('Error: ', error);
                return null;
            }
        });
    }
}
exports.default = CommentService;
//# sourceMappingURL=comments.service.js.map