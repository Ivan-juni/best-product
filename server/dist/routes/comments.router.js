"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const async_handler_middleware_1 = __importDefault(require("../middlewares/async-handler.middleware"));
const comments_controller_1 = __importDefault(require("../controllers/comments.controller"));
const router = express_1.default.Router();
// ?productId=
router.get('/', (0, async_handler_middleware_1.default)(comments_controller_1.default.getProductComments));
router.use(auth_middleware_1.default);
router.get('/user', (0, async_handler_middleware_1.default)(comments_controller_1.default.getUserComments));
// ?productId=
router.post('/', (0, async_handler_middleware_1.default)(comments_controller_1.default.addComment));
// ?commentId=
router.patch('/', (0, async_handler_middleware_1.default)(comments_controller_1.default.updateComment));
// ?commentId=
router.delete('/', (0, async_handler_middleware_1.default)(comments_controller_1.default.deleteComment));
exports.default = router;
//# sourceMappingURL=comments.router.js.map