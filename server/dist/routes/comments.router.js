"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const comments_controller_1 = __importDefault(require("../controllers/comments.controller"));
const router = express_1.default.Router();
// @route get /api/comments/user
// @des Get user's comments
router.get('/user', auth_middleware_1.default, comments_controller_1.default.getUserComments);
// @route GET /api/comments/:productId
// @des Get product comments
router.get('/:productId', comments_controller_1.default.getProductComments);
// @route POST /api/comments/:productId
// @des Add comment to product
router.post('/:productId', auth_middleware_1.default, comments_controller_1.default.addComment);
// @route DELETE /api/comments/:commentId
// @des Delete comment
router.delete('/:commentId', auth_middleware_1.default, comments_controller_1.default.deleteComment);
exports.default = router;
//# sourceMappingURL=comments.router.js.map