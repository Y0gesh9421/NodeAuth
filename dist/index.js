"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
require("reflect-metadata");
const db_1 = require("./database/db");
const route_1 = require("./middelware/routes/route");
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const port = process.env.PORT;
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
try {
    db_1.AppDataSource.initialize().then(() => {
        console.log("Database Connected..!!");
    })
        .catch((err) => {
        console.log("Error:Database connaction failed..!!", err);
    });
    app.use(route_1.router);
    app.get("/", (req, res) => {
        res.send("Hello world!");
    });
    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
}
catch (err) {
    console.log(err);
}
//# sourceMappingURL=index.js.map