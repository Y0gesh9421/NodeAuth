import { Router } from "express";
import { authorize } from "../middelware/controller/authorization";
import { createData, deleteData, readData, updateData } from "../main/crud.controller";
import { AuthenticatedUser } from "../middelware/controller/auth.controller";


export const userRout = Router()
userRout.post('/read', AuthenticatedUser, authorize, readData)
userRout.post('/create', AuthenticatedUser, authorize, createData)
userRout.post('/update', AuthenticatedUser, authorize, updateData)
userRout.post('/delete', AuthenticatedUser, authorize, deleteData)
