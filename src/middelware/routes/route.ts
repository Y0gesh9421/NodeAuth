import express, { Router } from "express";
import { Login } from "../controller/auth.controller";
import { AuthenticatedUser } from "../controller/auth.controller";
import { Refresh } from "../controller/auth.controller";
import { Logout } from "../controller/auth.controller";
import { Register } from "../controller/auth.controller";

export const router = express.Router()
    router.post('/api/register', Register)
    router.post('/api/login', Login)
    router.get('/api/user', AuthenticatedUser)
    router.post('/api/refresh', Refresh)
    router.get('/api/logout', Logout)
