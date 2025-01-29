import {Request, Response} from 'express'
import {UserService} from "../../service/user/user.service";
import {IUser, User} from "../../models/user/user.models";
import {Route} from "../../decorators/router.decorators";
import {IFindUser} from "../../interfaces/findUser.interfaces";
import {STATUSCODE} from "../../enum/statusCode/statusCode.enum";
import {CryptoHelper} from "../../helpers/crypto.helper";
import {DAYS_ACCOUNT_BLOCKED, MAXIMUM_LOGIN_ATTEMPTS, TIME_EXPIRATION_CONFIRM} from "../../constants/user.constants";
import {validateDto} from "../../middleware/validateDTO";
import {UserDto} from "../../dtos/user.dto";
import {EmailService} from "../../service/email/email.service";
import {tokenGenerator} from "../../helpers/token.helper";
import {ISecurity} from "../../interfaces/security.interfaces";

export class UserController {

    private userService: UserService;
    private emailService: EmailService;

    constructor() {
        this.userService = new UserService();
        this.emailService = new EmailService();

    }

    @Route("delete", "/deleteUser")
    async delete(request: Request, response: Response) {

        const result = await this.userService.delete(request.body as IUser)

        if (result) {
            return response.status(201).send({
                message: "User deleted successfully",
            })
        }
        return response.status(404).send({})
    }

    @Route("post", "/insert", validateDto(UserDto))
    async register(request: Request, response: Response) {

        const user: IUser = request.body
        const hasUserExist = await this.userService.insert(user)

        if (!hasUserExist) {
            return response.status(STATUSCODE.CONFLICT).send({
                message: 'Usuário ja existente.'
            })
        }

        const findUser = await this.userService.findBy(user)

        const token = tokenGenerator(32, '-')

        const sendEmail = await this.emailService.sendEmail({
            user,
            email: {
                subject: 'Confirmação de Identificação',
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
            if (findUser) {
                const dateNow = new Date()
                dateNow.setMinutes(TIME_EXPIRATION_CONFIRM)
                this.userService.update({email: findUser.email}, {
                    ...findUser,
                    security: {
                        ...findUser.security,
                        confirmEmailToken: token,
                        confirmEmailExpiration: BigInt(dateNow.getTime()),
                    } as ISecurity
                })
            }
            return response.status(STATUSCODE.CREATED).send({
                message: "Um token foi enviado para o seu e-mail. Utilize-o para confirmá-lo em nosso site."
            })
        }

        return response.status(STATUSCODE.BAD_GATEWAY).send({
            message: "Ocorreu um erro temporário com nosso provedor de e-mail."
        })
    }

    @Route("get", "/findUser")
    async login(request: Request, response: Response) {
        const {email, password}: IFindUser = request.body
        const findUser = await this.userService.findBy({dateOfBirth: "", name: "", email, password})

        if (findUser) {
            const dateNow = new Date();
            const isAccountLocked = findUser.security.isAccountLocked;
            const confirmEmailAccount = findUser.security.confirmEmailAccount;

            if (!confirmEmailAccount) {
                return response.status(STATUSCODE.NOT_FOUND).send({
                    message: 'Não identificamos a confirmação de email, identifique seu email.'
                })
            }

            if (isAccountLocked) {
                const releaseDate = new Date(Number(findUser.security.lockUntil))

                if (dateNow.getTime() >= releaseDate.getTime()) {
                    this.userService.update({email: findUser.email}, {
                        ...findUser,
                        security: {
                            ...findUser.security,
                            failedLoginAttempts: 0,
                            isAccountLocked: false,
                            lockUntil: 0n
                        }
                    })
                    return response.status(STATUSCODE.OK).send({
                        message: 'Acesso liberado para novas tentativas.'
                    })
                }

                return response.status(STATUSCODE.CONFLICT).send({
                    message: `Tentativas bloqueadas. Tente novamente no dia ${releaseDate.toLocaleString('pt-BR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}.`
                })
            }

            const passwordUser = CryptoHelper.decrypt(findUser.password);

            if (passwordUser !== password) {
                if (MAXIMUM_LOGIN_ATTEMPTS - findUser.security.failedLoginAttempts === 0) {
                    dateNow.setDate(dateNow.getDate() + DAYS_ACCOUNT_BLOCKED)
                    this.userService.update({email: findUser.email}, {
                        ...findUser,
                        security: {
                            ...findUser.security,
                            failedLoginAttempts: findUser.security.failedLoginAttempts + 1,
                            isAccountLocked: true,
                            lockUntil: BigInt(dateNow.getTime())
                        }
                    })
                    return response.status(STATUSCODE.BAD_REQUEST).send({
                        message: 'Seu login foi temporariamente bloqueado.'
                    })
                }

                this.userService.update({email: findUser.email}, {
                    ...findUser,
                    security: {
                        ...findUser.security,
                        failedLoginAttempts: findUser.security.failedLoginAttempts + 1
                    }
                })

                return response.status(STATUSCODE.CONFLICT).send({
                    message: `Senha incorreta. Você ainda possue mais ${MAXIMUM_LOGIN_ATTEMPTS - findUser.security.failedLoginAttempts} tentativas.`
                })
            }

            return response.status(STATUSCODE.FOUND).send({
                data: {
                    email: findUser.email,
                    name: findUser.name,
                    roles: findUser.roles,
                } as IUser,
                message: 'Acesso liberado.'
            })
        }
        return response.status(STATUSCODE.NOT_FOUND).send({
            message: 'Usuário não encontrado.'
        })
    }
}