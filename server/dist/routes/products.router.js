"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
// Where store download files
const storage = multer_1.default.diskStorage({
    destination: './assets/products',
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
// @route POST /api/goods/ || /api/goods?id= || /api/goods?category= || /api/goods?price=800-1000 etc.
// @des Get goods
router.get('/', () => { });
// ! Admin panel
// @route POST /api/goods/
// @des Add a good
router.post('/', upload.single('image'), () => { });
// @route DELETE /api/goods?id=
// @des Delete a good
router.delete('/', () => { });
exports.default = router;
//# sourceMappingURL=products.router.js.map