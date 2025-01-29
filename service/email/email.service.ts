import {IEmailSendProps, IEmailServiceContract} from "../../interfaces/email.interfaces";

import {createTransport, Transporter} from 'nodemailer'
import SMTPTransport from "nodemailer/lib/smtp-transport";

class Nodemaile {

    private readonly nodemailer: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options> | null = null;

    constructor() {
        if (!this.nodemailer) {
            this.nodemailer = createTransport({
                service: "gmail",
                auth: {
                    user: process.env.USER,
                    pass: process.env.PASS,
                }
            })
        }
    }


    public getInstanceNodemailer() {
        return this.nodemailer
    }
}

export class EmailService implements IEmailServiceContract<any> {

    private nodemailer: Nodemaile = new Nodemaile();

    constructor() {

    }

    confirmEmail(data: any): void {

    }

    forgotPassword(data: any): void {
    }

    recoverPassword(data: any): void {
    }

    resendEmailConfirmation(data: any): void {
    }


    async sendEmail(data: IEmailSendProps): Promise<boolean> {

        const {accepted} = await this.nodemailer.getInstanceNodemailer().sendMail({
            from: process.env.EMAIL_PROVIDER, // sender address
            to: {
                address: data.user.email,
                name: data.user.name,
            }, // list of receivers
            subject: data.email.subject, // Subject line
            html: data.email.html, // html body
        })

        return accepted.every(email => email === data.user.email)
    }

}