"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};
exports.default = asyncHandler;
//# sourceMappingURL=async-handler.middleware.js.map