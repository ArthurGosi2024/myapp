import {UserDto} from "../dtos/user.dto";

export interface IEmailServiceContract<T> {

    sendEmail: (data: T) => Promise<boolean>
}


export interface IEmailSendProps {
    user: Pick<UserDto, 'email' | "name">
    email: {
        subject: string;
        html: string;
    }
}