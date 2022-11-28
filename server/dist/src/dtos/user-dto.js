"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserDto {
    constructor(model) {
        this.email = model.email;
        this.phone = model.phone;
        this.id = model.id;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.role = model.role;
        this.photo = model.photo;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
}
exports.default = UserDto;
//# sourceMappingURL=user-dto.js.map