import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/user";
import jwt from 'jsonwebtoken';
import { userRepository } from "./auth.controller";

export const authorize = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;
  const secretKey = "access_secret";

  const payload = Object(jwt.verify(token, secretKey))
  console.log("🚀 ~ file: authorization.ts:14 ~ authorize ~ pay:", payload.email)

  const user = await userRepository.findOne({ where: { email: payload.email } });
  console.log("🚀 ~ file: authorization.ts:11 ~ return ~ user:", user)
  console.log('req.body.role', req.body.role)

  if (user.role !== req.body.role) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const permissions: string[] = req.body.permissions
  console.log("🚀 ~ file: authorization.ts:24 ~ authorize ~ permissions:", permissions)

  const hasPermissions = permissions.every(permission => user.permissions.includes(permission));
  console.log("🚀 ~ file: authorization.ts:26 ~ authorize ~ hasPermissions:", hasPermissions)

  if (!hasPermissions) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
}


