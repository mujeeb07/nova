import nodemailer from "nodemailer";

export const sendOtpEmail = async (email: string, otp: string) => {
    const user = process.env.MAIL_USER;
    const pass = process.env.MAIL_PASSWORD;
    const exp = process.env.OTP_EXPIRY_MINUTES;

    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
            user, 
            pass
        }
    });

    transporter.sendMail({
        from: user,
        to: email,
        subject: "Your OTP",
        text:`use this otp ${otp} for verify your email and it will expires in ${exp} minutes`
    })


}