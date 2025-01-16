import {Request, Response} from 'express'
import {UserService} from "../service/user/user.service";
import {IUser, User} from "../models/user/user.models";
import {Route} from "../decorators/router.decorators";
import {IFindUser} from "../interfaces/findUser.interfaces";
import {STATUSCODE} from "../enum/statusCode/statusCode.enum";
import {CryptoHelper} from "../helpers/crypto.helper";
import {DAYS_ACCOUNT_BLOCKED, MAXIMUM_LOGIN_ATTEMPTS} from "../constants/user.constants";
import {validateDto} from "../middleware/validateDTO";
import {UserDto} from "../dtos/user.dto";

export class UserController {

    private service: UserService;

    constructor(private userService: UserService) {
        this.service = new UserService();
    }

    @Route("delete", "/deleteUser")
    async delete(request: Request, response: Response) {

        const result = await this.service.delete(request.body as IUser)

        if (result) {
            return response.status(201).send({
                message: "User deleted successfully",
            })
        }
        return response.status(404).send({})
    }

    @Route("post", "/insert",validateDto(UserDto))
    async register(request: Request, response: Response) {

        const user :  IUser = request.body
        const result = await this.service.insert(user)

        if (!result) {
            return response.status(STATUSCODE.CONFLICT).send({
                message: 'Usuário ja existente.'
            })
        }
        return response.status(STATUSCODE.CREATED).send({
            message: 'Usuário criado com sucesso.'
        })
    }

    @Route("get", "/findUser")
    async login(request: Request, response: Response) {

        const {email, password}: IFindUser = request.body
        const findUser = await this.service.findBy({dateOfBirth: "", name: "", email, password})

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
                    this.service.update({email: findUser.email}, {
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
                    this.service.update({email: findUser.email}, {
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

                this.service.update({email: findUser.email}, {
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