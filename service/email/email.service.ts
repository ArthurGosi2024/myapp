import {
	IEmailSendProps,
	IEmailServiceContract,
} from "../../interfaces/email.interfaces";

import { createTransport, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { UserService } from "../user/user.service";
import { User } from "../../models/user/user.models";

class Nodemaile {
	private readonly nodemailer: Transporter<
		SMTPTransport.SentMessageInfo,
		SMTPTransport.Options
	> | null = null;

	constructor() {
		if (!this.nodemailer) {
			this.nodemailer = createTransport({
				service: "gmail",
				auth: {
					user: process.env.USER,
					pass: process.env.PASS,
				},
			});
		}
	}

	public getInstanceNodemailer() {
		return this.nodemailer;
	}
}

export class EmailService implements IEmailServiceContract<any> {
	private nodemailer: Nodemaile = new Nodemaile();

	constructor() {}

	async sendEmail(data: IEmailSendProps): Promise<boolean> {
		const { accepted } = await this.nodemailer
			.getInstanceNodemailer()
			.sendMail({
				from: process.env.EMAIL_PROVIDER,
				to: {
					address: data.user.email,
					name: data.user.name,
				},
				subject: data.email.subject,
				html: data.email.html,
			});

		return accepted.every((email) => email === data.user.email);
	}
}
