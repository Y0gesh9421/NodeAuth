import express, { Request, Response } from "express";
import dotenv from "dotenv";
import "reflect-metadata";
import { AppDataSource } from "./database/db";
import { router } from "./middelware/routes/route";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();
const port = process.env.PORT;
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

try {
    AppDataSource.initialize().then(() => {
        console.log("Database Connected..!!")
    })
        .catch((err) => {
            console.log("Error:Database connaction failed..!!", err);
        })

    app.use(router)



    app.get("/", (req: Request, res: Response) => {
        res.send("Hello world!");
    });

    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
} catch (err) {
    console.log(err)
}

