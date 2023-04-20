import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import "reflect-metadata"
import { AppDataSource } from './dbConfig';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript + Typeorm + MySQL Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

AppDataSource.initialize().then(async () => {

    console.log("Connected to database...")

}).catch(error => console.log(error))
