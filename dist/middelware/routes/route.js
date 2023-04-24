"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
const auth_controller_2 = require("../controller/auth.controller");
const auth_controller_3 = require("../controller/auth.controller");
const auth_controller_4 = require("../controller/auth.controller");
const auth_controller_5 = require("../controller/auth.controller");
exports.router = express_1.default.Router();
exports.router.post('/api/register', auth_controller_5.Register);
exports.router.post('/api/login', auth_controller_1.Login);
exports.router.get('/api/user', auth_controller_2.AuthenticatedUser);
exports.router.post('/api/refresh', auth_controller_3.Refresh);
exports.router.get('/api/logout', auth_controller_4.Logout);
//# sourceMappingURL=route.js.map