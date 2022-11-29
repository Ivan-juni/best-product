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
    if (imagePath) {
        const oldPath = path_1.default.join(__dirname, '..', '..', 'assets', `${folder}`, path_1.default.basename(imagePath));
        if (fs_1.default.existsSync(oldPath)) {
            fs_1.default.unlink(oldPath, (err) => {
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