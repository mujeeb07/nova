import nodemailer from "nodemailer";


export class NodemailerEmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });
    }

    async sendTestEmail(): Promise<void> {
        await this.transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: "mujibworkoutsbt@gmail.com",
            subject: "Nova Platforms - Test Email",
            text: "Nodemailer is working successfully!",
        });
    }
}