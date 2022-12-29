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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_setup_1 = __importDefault(require("./db/db.setup"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const router_1 = __importDefault(require("./routes/router"));
const error_handling_middleware_1 = __importDefault(require("./middlewares/error-handling.middleware"));
const path_1 = __importDefault(require("path"));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const app = (0, express_1.default)();
        app.get('/', (req, res) => res.status(200).json({ message: 'Server is working' }));
        (0, db_setup_1.default)();
        dotenv_1.default.config();
        const port = process.env.PORT || 8000;
        app.use((0, cors_1.default)({ credentials: true, origin: true }));
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: false }));
        app.use((0, cookie_parser_1.default)());
        // Path to images folder
        app.use('/static', express_1.default.static(path_1.default.join(__dirname, '..', 'assets')));
        // main router
        app.use('/api', router_1.default);
        // Обработка ошибок, последний middleware
        app.use(error_handling_middleware_1.default);
        app.listen(port, () => console.log(`Server is listening on port ${port}`));
    }
    catch (error) {
        console.log(error);
    }
});
start();
//# sourceMappingURL=index.js.map