// @ts-nocheck

import {UserDto} from "../../dtos/user.dto";
import {ISecurity} from "../../interfaces/security.interfaces";
import {Role, Security} from "@prisma/client"

export interface IUser extends UserDto {
    userId?: string;
    roles?: Role[];
    phone?: string;
    security?: Security
}


export class User {
    user: IUser | null = null;
    security: Security | null = null;


    constructor(newUser: IUser, security: Security) {
        Object.assign(this.user, newUser)
        Object.assign(this.security, security)
    }

    getAge(): number {
        if (this.user) {
            return this.user?.age!;
        }
        return 0
    }

    getDateOfBirth(): string {
        if (this.user) {
            return this.user?.dateOfBirth!;
        }
    }

    updateSecurity(security: ISecurity) {
        this.security.updateSecurity(security);
    }

    getSecurity(): ISecurity {
        return this.security.getSecurity();
    }


    getEmail(): string {
        if (this.user) {
            return this.user?.email!;
        }
        return 'email not exist'
    }

    getName(): string {
        if (this.user) {
            return this.user?.name!;
        }
        return 'name not exist'
    }
}