import { Request, Response } from "express"
import { VerifyEmailDto } from "../../middelware/dto/verifyEmail.dto"
import { verifyEmailService } from "../service/mailer.service"

export const verifyEmail = async (req: Request, res: Response) => {
    const verifyBody: VerifyEmailDto = req.body
    const { email, otp } = verifyBody
    res.send(await verifyEmailService(email, otp))
}