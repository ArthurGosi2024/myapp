import {UserDto} from "../dtos/user.dto";

export interface IEmailServiceContract<T> {
    recoverPassword: (data: T) => void
    confirmEmail: (data: T) => void
    forgotPassword: (data: T) => void
    resendEmailConfirmation: (data: T) => void
    sendEmail: (data: T) => Promise<boolean>
}


export interface IEmailSendProps {
    user: Pick<UserDto, 'email' | "name">
    email: {
        subject: string;
        html: string;
    }
}