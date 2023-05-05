import { Request, Response } from "express";
import { create, del, read, update } from "./crud.service";

export const createData = (req: Request, res: Response) => {
    const data = create()
    res.status(200).send(data)
}

export const updateData = (req: Request, res: Response) => {
    const data = update()
    res.status(200).send(data)
}

export const readData = (req: Request, res: Response) => {
    const data = read()
    res.status(200).send(data)
}

export const deleteData = (req: Request, res: Response) => {
    const data = del()
    res.status(200).send(data)
}