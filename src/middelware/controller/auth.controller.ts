import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt"
import { sign, verify } from 'jsonwebtoken';
import { User } from "../entity/user";
import { AppDataSource } from "../../database/db";
import { UserCreationDto } from "../dto/user.dto";
import validator from 'validator';
import { error } from "console";
import { genOtp } from "../../mailer/service/mailer.service";
import { sendMail } from "../../mailer/service/mailer.service";


export const userRepository = AppDataSource.getRepository(User)


export const Register = async (req: Request, res: Response) => {
    console.log(req.body)
    try {
        const body: UserCreationDto = req.body
        const { name, email, password, mobileNo, role, permissions } = body;
        if (!validator.isAlpha(name)) {
            res.status(400).send({ Message: "Name should have alphabets only" })
            throw error;
        };
        if (!validator.isEmail(email)) {
            res.status(400).send({ Message: "Invalid email" })
            throw error;
        };
        if (!validator.isStrongPassword(password,
            {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1
            }
        )) {
            res.status(400).send({ Message: "Weak password" })
            throw error;
        };
        if (!validator.isLength(mobileNo, { min: 10, max: 10 })) {
            res.status(400).send({ Message: "Mobile number should be 10 digits only" })
            throw error;
        };
        const otp: string = await genOtp();
        try {
            const user = await userRepository.save({
                name,
                email,
                password: await bcrypt.hash(password, 10),
                mobileNo,
                otp,
                role,
                permissions
            })
            console.log('user', user)
            sendMail(email, otp)
            res.send({ id: user.id, email: user.email, name: user.name, mobileNo: user.mobileNo, role: user.role, permissions: user.permissions, verifiedEmail: user.verifiedEmail });
        }
        catch {
            throw new Error("Error while storing data")
        }

    }
    catch {

        console.log('Error in input data')
        throw new Error("Error while validating data")
    }


}



export const Login = async (req: Request, res: Response) => {
    const { email, password, } = req.body;

    const user = await userRepository.findOne({
        where: {
            email
        }
    });
    console.log('user', user)

    if (!user) {
        return res.status(400).send({
            message: 'Invalid email'
        })
    }

    if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).send({
            message: 'Invalid Credentials'
        })
    }

    if (user.verifiedEmail) {
        const accessToken = sign({
            email: user.email
        }, "access_secret", { expiresIn: 60 * 60 });

        const refreshToken = sign({
            email: user.email
        }, "refresh_secret", { expiresIn: 24 * 60 * 60 })

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.send({
            message: 'success'
        });

    }

    if (!user.verifiedEmail) {
        res.send({ Messsage: " Account not verified " })
    }
}

export const AuthenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("req.cookies", req.cookies);
        const accessToken = req.cookies.accessToken;

        const payload: any = verify(accessToken, "access_secret");
        console.log("🚀 ~ file: auth.controller.ts:127 ~ AuthenticatedUser ~ payload:", payload)

        if (!payload) {
            console.log("in payload")
            return res.status(401).send({
                message: 'Unauthenticated'
            })
        }

        const user = await userRepository.findOne({
            where: {
                id: payload.id
            }
        });
        console.log("🚀 ~ file: auth.controller.ts:140 ~ AuthenticatedUser ~ user:", user)

        if (!user) {
            console.log('in user')
            return res.status(401).send({
                message: 'Unauthenticated'
            })
        }

        const { password, ...data } = user;
        next()

    } catch (e) {
        console.log(e)
        return res.status(401).send({
            message: 'Unauthenticated'
        })
    }
}

export const Refresh = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        const payload: any = verify(refreshToken, "refresh_secret");

        if (!payload) {
            return res.status(401).send({
                message: 'unauthenticated'
            })
        }

        const accessToken = sign({
            id: payload.id,
        }, "access_secret", { expiresIn: 60 * 60 })

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.send({
            message: 'success'
        })

    } catch (e) {
        return res.status(401).send({
            message: 'unauthenticated'
        })
    }
}

export const Logout = async (req: Request, res: Response) => {
    console.log("Logout ...")
    res.cookie('accessToken', '', { maxAge: 0 });
    res.cookie('refreshToken', '', { maxAge: 0 });
}