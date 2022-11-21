"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserDto {
    //   !todo model type
    constructor(model) {
        this.email = model.email;
        this.phone = model.phone;
        this.id = model.id;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.role = model.role;
    }
}
exports.default = UserDto;
//# sourceMappingURL=user-dto.js.map