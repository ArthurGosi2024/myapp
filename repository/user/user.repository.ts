import {DatabaseInfra} from "../../infra/database.infra";
import {IContractRepositoryCrudGenerics} from "../../interfaces/contractCrudGenerics.interfaces";
import {IUser, User} from "../../models/user/user.models";
import {ROLE} from "../../enum/roles/roles.enum";
import {randomUUID} from "node:crypto";
import {Security} from "../../models/security/security.models";

export class UserRepository extends DatabaseInfra implements IContractRepositoryCrudGenerics<IUser> {

    constructor() {
        super();
    }

    async delete(data: Pick<IUser, "email">): Promise<void> {
        await this.instance.user.delete({
            where: {
                email: data.email,
            },
        })
    }

    async findBy(data: Partial<IUser>): Promise<IUser> {
        const findUser = await this.instance.user.findFirst({
            where: {
                email: data.email
            },
            include: {
                security: true,
                roles: true
            }
        })

        return findUser
    }


    async insert(data: IUser): Promise<void> {

        await this.instance.user.create({
            data: {
                email: data.email,
                name: data.name,
                age: data.age,
                phone: data.phone,
                dateOfBirth: data.dateOfBirth,
                password: data.password,
                roles: {
                    create: {
                        role: ROLE.USER,
                        roleId: randomUUID(),
                    }
                },
                security: {
                    create: {
                        failedLoginAttempts: 0,
                        confirmEmailAccount: false,
                        confirmEmailExpiration: "",
                        confirmEmailToken: '',
                        lockUntil: 0,
                        isAccountLocked: false,
                        passwordResetExpiration: "",
                        passwordResetToken: ""
                    }
                }
            },
        })


    }

    async update(data: Partial<IUser>, dataNew: Partial<IUser>): Promise<void> {
        await this.instance.user.update({
            data: {
                ...dataNew,
                roles: {},
                security: dataNew.security ? {
                    update: {
                        data: {
                            failedLoginAttempts: dataNew.security.failedLoginAttempts,
                            isAccountLocked: dataNew.security.isAccountLocked,
                            lockUntil: dataNew.security.lockUntil,
                            passwordResetExpiration: dataNew.security.passwordResetExpiration,
                            passwordResetToken: dataNew.security.passwordResetToken,
                            confirmEmailAccount: dataNew.security.confirmEmailAccount,
                            confirmEmailToken: dataNew.security.confirmEmailToken,
                            confirmEmailExpiration: dataNew.security.confirmEmailExpiration
                        },

                    }
                } : {},
            },
            where: {
                email: data.email,
            },
        });
    }
}
