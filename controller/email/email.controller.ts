import { Route } from "../../decorators/router.decorators";
import { Request, Response } from "express";
import { UserService } from "../../service/user/user.service";
import { STATUSCODE } from "../../enum/statusCode/statusCode.enum";
import { EmailService } from "../../service/email/email.service";
import { tokenGenerator } from "../../helpers/token.helper";
import {TIME_EXPIRATION_CONFIRM_EMAIL, TIME_EXPIRATION_FORGOT_PASSWORD} from "../../constants/user.constants";
import { ISecurity } from "../../interfaces/security.interfaces";
import {RecoverDTO} from "../../dtos/user.dto";
import {validateDto} from "../../middleware/validateDTO";

export class EmailController {
	private userService: UserService;
	private emailService: EmailService;

	constructor() {
		this.userService = new UserService();
		this.emailService = new EmailService();
	}

	@Route("post", "/confirm-email")
	async confirmEmail(request: Request, response: Response) {
		const { email, token } = request.body as { token: string; email: string };
		const findUser = await this.userService.findBy({ email });

		if (!findUser) {
			return response.status(STATUSCODE.NOT_FOUND).send({
				message: "Usuário não encontrado.",
			});
		}

		const timeNow = new Date().getTime();
		const tokenOfConfirmation = findUser.security.confirmEmailToken;
		const hasConfirmEmailAccount = findUser.security.confirmEmailAccount;

		if (hasConfirmEmailAccount) {
			return response.status(STATUSCODE.UNAUTHORIZED).send({
				message: "Esta conta ja possue um email verificado.",
			});
		}

		const timeOfConfirmationEmail = Number(
			findUser.security.confirmEmailExpiration
		);

		if (timeNow > timeOfConfirmationEmail) {
			return response.status(STATUSCODE.UNAUTHORIZED).send({
				message: "Token expirado.",
			});
		}

		if (tokenOfConfirmation !== token) {
			return response.status(STATUSCODE.CONFLICT).send({
				message: "Token incorreto.",
			});
		}

		this.userService.update(
			{ ...findUser },
			{
				...findUser,
				security: {
					...findUser.security,
					confirmEmailToken: "",
					confirmEmailExpiration: 0n,
					confirmEmailAccount: true,
				},
			}
		);

		const hasAuthenticated = request.session["authenticated"];

		if (!hasAuthenticated) {
			request.session["authenticated"] = true;
		}

		return response.status(STATUSCODE.OK).send({
			message: "Token verificado com sucesso.",
		});
	}


	@Route("post","/forgot-password")
	async forgotPassword(request: Request, response: Response) {
		const { email } = request.body as { email : string;   }

		const user = await this.userService.findBy({ email });

		if (!user) {
			return response.status(STATUSCODE.UNAUTHORIZED).send({
				message: 'Usuário não encontrado.'
			})
		}

		const dateNow = new Date()
		const currentTime = dateNow.getTime()
		const tokenPasswordResend = user.security.passwordResetToken
		const timeExpirationPassword = Number(user.security.passwordResetExpiration)

		if (timeExpirationPassword > 0 && timeExpirationPassword < currentTime && tokenPasswordResend.length) {
			return response.status(STATUSCODE.SERVICE_UNAVAILABLE).send({
				message: "Um token ja foi enviado ao seu email, utilize-o para recuperar sua senha."
			})
		}

		const token = tokenGenerator(10,'-')

		const sendEmail = await this.emailService.sendEmail({
			user,
			email: {
				subject: "Recuperação de Senha",
				html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h1 style="color: #4caf50;">Recuperação de Senha</h1>
                <p>Olá, ${user.name}</p>
                <p>Recebemos uma solicitação para redefinir sua senha. Para continuar, utilize o link abaixo:</p>
                <h2 style="text-align: center ; font-weight: bold">
                	${token}
                </h2>
                <p>Atenção, o tempo máximo para uso do link é de 15 minutos. Caso expire, será necessário solicitar uma nova recuperação de senha.</p>
                <p>Se você não solicitou essa ação, ignore este e-mail. Caso tenha dúvidas, entre em contato com nossa equipe de suporte.</p>
                <p>Atenciosamente,</p>
                <p><strong>Equipe Api-Login</strong></p>
            </div>
        `,
			},
		});

		if (sendEmail) {
			dateNow.setMinutes(TIME_EXPIRATION_FORGOT_PASSWORD)
			this.userService.update(user,{...user, security : {
			...user.security,
				passwordResetToken : token,
				passwordResetExpiration: BigInt(dateNow.getTime())
			}})
			return response.status(STATUSCODE.CREATED).send({
				message:
					"Um token foi enviado para o seu e-mail. Utilize-o para recuperar a senha em nosso site.",
			});
		}

		return response.status(STATUSCODE.BAD_GATEWAY).send({
			message: "Ocorreu um erro temporário com nosso provedor de e-mail.",
		});

	}
	@Route("post","/recover-password",validateDto(RecoverDTO))
	 async recoverPassword(request: Request, response: Response) {
		const {  token,email, password } = request.body as { email : string; password: string, token: string; }

		 const user = await this.userService.findBy({ email });

		 if (!user) {
			 return response.status(STATUSCODE.UNAUTHORIZED).send({
				 message: 'Usuário não encontrado.'
			 })
		 }

		 const dateNow = new Date();
		 const currentTime = dateNow.getTime();
		 const currentTokenReset = user.security.passwordResetToken
		 const currentTimeOfExpirationPasswordReset = Number(user.security.passwordResetExpiration);

		 if (currentTime > currentTimeOfExpirationPasswordReset) {
			 return response.status(STATUSCODE.CONFLICT).send({ message: "Token expirado." })
		 }


		 if (token !== currentTokenReset) {
			 return response.status(STATUSCODE.CONFLICT).send({
				 message: 'Token incorreto.'
			 })
		 }

		 this.userService.update(user,{
			 ...user,
			 password : password,
			 security : {
				 ...user.security,
				 passwordResetExpiration : 0n,
				 passwordResetToken : "",
			 }
		 })


		return response.status(STATUSCODE.OK).send({
			message: 'Senha alterada com sucesso.'
		})
	}

	@Route("post", "/resend-email-confirmation")
	async resendEmailConfirmation(request: Request, response: Response) {
		const { email } = request.body as { email: string };

		const user = await this.userService.findBy({ email });

		if (user) {
			const hasConfirmEmailAccount = user.security.confirmEmailAccount;
			if (hasConfirmEmailAccount) {
				return response.status(STATUSCODE.UNAUTHORIZED).send({
					message: "Esta conta ja possue um email verificado.",
				});
			}

			const token = tokenGenerator(32, "-");

			const sendEmail = await this.emailService.sendEmail({
				user,
				email: {
					subject: "Confirmação de Identificação",
					html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h1 style="color: #4caf50;">Confirmação de Identificação</h1>
                        <p>Olá,${user.name}</p>
                        <p>Recebemos uma solicitação para confirmar sua identificação em nosso sistema. Para concluir o processo, use o código abaixo:</p>
                        <h2 style="text-align: center; color: #4caf50;">${token}</h2>
                        <p>Atenção o tempo maiximo para uso do token e de 15 minutos. Caso expire, tera que solicitar, outra confirmação de email.</p>
                        <p>Se você não solicitou essa ação, ignore este e-mail. Caso tenha dúvidas, entre em contato com nossa equipe de suporte.</p>
                        <p>Atenciosamente,</p>
                        <p><strong>Equipe Api-Login</strong></p>
                    </div>
            `,
				},
			});

			if (sendEmail) {
				const dateNow = new Date();
				dateNow.setMinutes(TIME_EXPIRATION_CONFIRM_EMAIL);
				this.userService.update(
					{ email: user.email },
					{
						...user,
						security: {
							...user.security,
							confirmEmailToken: token,
							confirmEmailExpiration: BigInt(dateNow.getTime()),
						} as ISecurity,
					}
				);
				return response.status(STATUSCODE.CREATED).send({
					message:
						"Um token foi enviado para o seu e-mail. Utilize-o para confirmá-lo em nosso site.",
				});
			}

			return response.status(STATUSCODE.BAD_GATEWAY).send({
				message: "Ocorreu um erro temporário com nosso provedor de e-mail.",
			});
		}
	}
}
