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
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
function seed(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        // Inserts seed entries
        yield knex('users').insert([
            {
                email: 'admin@gmail.com',
                phone: 380994960349,
                password: '$2b$04$AJz/c1BJBnMhckc4vJfv2.r5ZoPKkhTnoMgmNUrPpPY4CLfpHqwV2',
                firstName: 'Admin',
                lastName: 'Admin',
                role: 'ADMIN',
                photo: 'http://localhost:8000/static/users/admin-1669204612771.png',
            },
        ]);
    });
}
exports.seed = seed;
//# sourceMappingURL=2_add_admin.js.map