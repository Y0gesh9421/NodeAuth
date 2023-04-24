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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logout = exports.Refresh = exports.AuthenticatedUser = exports.Login = exports.Register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
const user_1 = require("../entity/user");
const db_1 = require("../../database/db");
const userRepository = db_1.AppDataSource.getRepository(user_1.User);
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const body = req.body;
        const { name, email, password } = body;
        const user = yield userRepository.save({
            name,
            email,
            password: yield bcrypt_1.default.hash(password, 10)
        });
        console.log('user', user);
        res.send({ id: user.id, email: user.email, name: user.name });
    }
    catch (_a) {
        res.send({ message: "Validation failed" });
    }
});
exports.Register = Register;
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield userRepository.findOne({
        where: {
            email
        }
    });
    console.log('user', user);
    if (!user) {
        return res.status(400).send({
            message: 'Invalid Credentials'
        });
    }
    if (!(yield bcrypt_1.default.compare(password, user.password))) {
        return res.status(400).send({
            message: 'Invalid Credentials'
        });
    }
    const accessToken = (0, jsonwebtoken_1.sign)({
        id: user.id
    }, "access_secret", { expiresIn: 60 * 60 });
    const refreshToken = (0, jsonwebtoken_1.sign)({
        id: user.id
    }, "refresh_secret", { expiresIn: 24 * 60 * 60 });
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.send({
        message: 'success'
    });
});
exports.Login = Login;
const AuthenticatedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req.cookies", req.cookies);
        const accessToken = req.cookies.accessToken;
        const payload = (0, jsonwebtoken_1.verify)(accessToken, "access_secret");
        if (!payload) {
            return res.status(401).send({
                message: 'Unauthenticated'
            });
        }
        const user = yield userRepository.findOne({
            where: {
                id: payload.id
            }
        });
        if (!user) {
            return res.status(401).send({
                message: 'Unauthenticated'
            });
        }
        const { password } = user, data = __rest(user, ["password"]);
        res.send(data);
    }
    catch (e) {
        console.log(e);
        return res.status(401).send({
            message: 'Unauthenticated'
        });
    }
});
exports.AuthenticatedUser = AuthenticatedUser;
const Refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        const payload = (0, jsonwebtoken_1.verify)(refreshToken, "refresh_secret");
        if (!payload) {
            return res.status(401).send({
                message: 'unauthenticated'
            });
        }
        const accessToken = (0, jsonwebtoken_1.sign)({
            id: payload.id,
        }, "access_secret", { expiresIn: 60 * 60 });
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.send({
            message: 'success'
        });
    }
    catch (e) {
        return res.status(401).send({
            message: 'unauthenticated'
        });
    }
});
exports.Refresh = Refresh;
const Logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Logout ...");
    res.cookie('accessToken', '', { maxAge: 0 });
    res.cookie('refreshToken', '', { maxAge: 0 });
});
exports.Logout = Logout;
//# sourceMappingURL=auth.controller.js.map