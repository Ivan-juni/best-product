"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePhoto = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Remove old photo
const removePhoto = (imagePath, folder) => {
    const folders = folder.split('/'); // ex: 'products/JBlT450' - > [products, JBlT450] || 'users' - > [users]
    // remove product's folder
    if (imagePath === '' && folders[0] === 'products' && folders[1]) {
        const dir = path_1.default.join(__dirname, '..', '..', 'assets', `${folder}`);
        fs_1.default.rmSync(dir, { recursive: true, force: true });
    }
    // remove product's image or user's photo
    else {
        const dir = path_1.default.join(__dirname, '..', '..', 'assets', `${folder}`, path_1.default.basename(imagePath));
        console.log(dir);
        if (fs_1.default.existsSync(dir)) {
            fs_1.default.unlink(dir, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        }
    }
};
exports.removePhoto = removePhoto;
//# sourceMappingURL=remove-photo.util.js.map