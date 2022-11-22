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
        // Deletes ALL existing entries
        yield knex('product_characteristics').del();
        // Inserts seed entries
        yield knex('product_characteristics').insert([
            {
                purpose: 'Listening music',
                description: "It's description for Headphones JBL T110",
                design: 'overhead, closed',
                connectionType: 'combined, 3.5 mm, Bluetooth v 5.0',
                microphone: true,
                batteryLiveTime: 12,
            },
            {
                purpose: 'Relax, intertaiment',
                description: 'It\'s description for Samsung Smart TV 40"',
                design: 'flat',
                connectionType: '220v cable, wireless, Bluetooth v 5.0',
                display: '40 inch, amoled',
            },
            {
                purpose: 'Work',
                description: "It's description for MacBook Pro M2 2022",
                design: 'space grey corps',
                connectionType: '220v cable, wireless, Bluetooth v 5.0',
                microphone: true,
                batteryLiveTime: 20,
                display: '14 inch, retina',
            },
            {
                purpose: 'For smartphone',
                description: "It's description for Apple Iphone 11",
                design: 'PRODUCT RED',
                connectionType: 'usb lightning, wireless, Bluetooth v 5.0',
                microphone: true,
                batteryLiveTime: 30,
                display: '5.7 inch, retina',
            },
            {
                purpose: 'For auto',
                description: "It's description for USB converter",
                connectionType: '12v to usb 3.0',
            },
        ]);
    });
}
exports.seed = seed;
//# sourceMappingURL=add_characteristics.js.map