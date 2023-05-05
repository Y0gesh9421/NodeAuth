
import { verifyEmail } from "../controller/mailer.controller";
import { Router } from "express";

export const mailer = Router()
mailer.post('/api/verify', verifyEmail)
