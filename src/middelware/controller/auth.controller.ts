import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { sign, verify } from 'jsonwebtoken';
import { User } from "../entity/user";
import { AppDataSource } from "../../database/db";
import { UserCreationDto } from "../dto/user.dto";

const userRepository = AppDataSource.getRepository(User)


export const Register = async (req: Request, res: Response) => {
    console.log(req.body)
    try {
        const body: UserCreationDto = req.body
        const { name, email, password } = body;

        const user = await userRepository.save({
            name,
            email,
            password: await bcrypt.hash(password, 10)
        })
        console.log('user', user)

        res.send({ id: user.id, email: user.email, name: user.name });
    }
    catch {
        res.send({ message: "Validation failed" })
    }


}

export const Login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await userRepository.findOne({
        where: {
            email
        }
    });
    console.log('user', user)

    if (!user) {
        return res.status(400).send({
            message: 'Invalid Credentials'
        })
    }

    if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).send({
            message: 'Invalid Credentials'
        })
    }

    const accessToken = sign({
        id: user.id
    }, "access_secret", { expiresIn: 60 * 60 });

    const refreshToken = sign({
        id: user.id
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

export const AuthenticatedUser = async (req: Request, res: Response) => {
    try {
        console.log("req.cookies", req.cookies);
        const accessToken = req.cookies.accessToken;

        const payload: any = verify(accessToken, "access_secret");

        if (!payload) {
            return res.status(401).send({
                message: 'Unauthenticated'
            })
        }

        const user = await userRepository.findOne({
            where: {
                id: payload.id
            }
        });

        if (!user) {
            return res.status(401).send({
                message: 'Unauthenticated'
            })
        }

        const { password, ...data } = user;

        res.send(data);

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