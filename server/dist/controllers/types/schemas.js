"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.addProductSchema = exports.editProfileSchema = exports.updCategorySchema = exports.addCategorySchema = exports.commentSchema = void 0;
const yup = __importStar(require("yup"));
// comments
exports.commentSchema = yup.object({
    commentText: yup.string().required(),
});
// categories
exports.addCategorySchema = yup.object({
    categoryName: yup.string().required('Category name is required'),
    parent: yup
        .string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .required('Parent is required'),
});
exports.updCategorySchema = yup.object({
    categoryName: yup.string().nullable(true),
    parent: yup
        .string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .nullable(true),
});
// users
exports.editProfileSchema = yup.object({
    email: yup.string().email(),
    phone: yup.number().nullable(true),
    photo: yup.string().nullable(true),
    password: yup
        .string()
        .min(4, 'Password should be longer than 3 symbols')
        .max(30, 'Password should be shorter than 30 symbols')
        .matches(/^[a-zA-Z0-9-]+$/, 'Only English letters and numbers'),
    firstName: yup.string().max(255, 'Firstname should be shorter than 255 symbols'),
    lastName: yup.string().max(255, 'Lastname should be shorter than 255 symbols'),
});
// products
exports.addProductSchema = yup.object({
    name: yup.string(),
    image: yup.string().required('Image is required').nullable(false),
    price: yup
        .string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .required('Price is required'),
    categoryId: yup
        .string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .required('Category id is required'),
    purpose: yup.string().required('Purpose is required'),
    description: yup
        .string()
        .min(10, 'Description should be larger than 10 symbols')
        .max(255, 'Description should be shorter than 255 symbols')
        .required('Description is required'),
    microphone: yup.string().default('false'),
    design: yup.string().nullable(true),
    connectionType: yup.string().nullable(true),
    batteryLiveTime: yup
        .string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .nullable(true),
    display: yup.string().nullable(true),
});
exports.updateProductSchema = yup.object({
    name: yup.string().nullable(true),
    image: yup.string().nullable(true),
    price: yup
        .string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .nullable(true),
    categoryId: yup
        .string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .nullable(true),
    purpose: yup.string().nullable(true),
    description: yup
        .string()
        .min(10, 'Description should be larger than 10 symbols')
        .max(255, 'Description should be shorter than 255 symbols')
        .nullable(true),
    microphone: yup.string().nullable(true),
    design: yup.string().nullable(true),
    connectionType: yup.string().nullable(true),
    batteryLiveTime: yup
        .string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .nullable(true),
    display: yup.string().nullable(true),
});
//# sourceMappingURL=schemas.js.map