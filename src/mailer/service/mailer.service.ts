import nodemailer from 'nodemailer'
import otpGenerator from 'otp-generator';
import { userRepository } from '../../middelware/controller/auth.controller';


export const sendMail = async (email: string, otp: string) => {
    const testAccount = await nodemailer.createTestAccount();
    const mailerTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        }
    })

    const verOtp = otp

    const mailerDetail = {
        from: 'yogesh.tambore@thinkitive.com',
        to: email,
        subject: 'Verify your email id',
        text: `Your verification code is ${verOtp}`
    }
    try {
        const mailDetails = await mailerTransporter.sendMail(mailerDetail)
        console.log("Email Id:", mailDetails.messageId)
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(mailDetails));
    }
    catch (err) {
        console.log("Mailer Module error : ", err)
    }


}

export const genOtp = async () => {
    return otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
}

export const verifyEmailService = async (emailId: string, otp: string): Promise<object> => {
    const userData = await userRepository.findOneBy({ email: emailId })
    console.log("🚀 ~ file: mailer.service.ts:44 ~ verifyEmailService ~ userData:", userData)
    if (userData.otp === otp) {
        userData.verifiedEmail = true;
        userData.otp = "0";
        await userRepository.save(userData)
        return { Message: "success" }
    }
    else {
        return { Message: 'Invalid Otp' }
    }

}