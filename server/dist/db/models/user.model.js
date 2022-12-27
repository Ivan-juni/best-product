"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const token_model_1 = __importDefault(require("./token.model"));
class User extends objection_1.Model {
    static get tableName() {
        return 'users';
    }
    $beforeInsert() {
        this.createdAt = new Date();
    }
    $beforeUpdate() {
        this.updatedAt = new Date();
    }
    static get emailColumn() {
        return 'email';
    }
    static get phoneColumn() {
        return 'phone';
    }
    static get passwordColumn() {
        return 'password';
    }
    static get firstNameColumn() {
        return 'firstName';
    }
    static get lastNameColumn() {
        return 'lastName';
    }
    static get roleColumn() {
        return 'role';
    }
    static get photoColumn() {
        return 'photo';
    }
    fullName() {
        return this.firstName + ' ' + this.lastName;
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['email', 'password', 'firstName', 'lastName', 'role'],
            properties: {
                id: { type: 'integer' },
                email: { type: 'string' },
                phone: { type: ['integer', 'null'] },
                password: { type: 'string' },
                firstName: { type: 'string', minLength: 1, maxLength: 255 },
                lastName: { type: 'string', minLength: 1, maxLength: 255 },
                role: { type: 'string', default: 'USER', minLength: 4, maxLength: 5 },
                photo: { type: ['string', 'null'], default: null, maxLength: 255 },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
            },
        };
    }
}
exports.default = User;
User.relationMappings = {
    tokens: {
        relation: objection_1.Model.HasOneRelation,
        modelClass: token_model_1.default,
        join: {
            from: 'users.id',
            to: 'tokens.userId',
        },
    },
};
//# sourceMappingURL=user.model.js.map