import {ISecurity} from "../../interfaces/security.interfaces";

export class Security {
    security: Partial<ISecurity>;

    constructor(security: Partial<ISecurity>) {
        Object.assign(this.security, security)
    }

    updateSecurity(security: Partial<ISecurity>) {
        // @ts-ignore
        this.security = {...this.security, security};
    }

    getSecurity(): Partial<ISecurity> {
        return this.security;
    }
}