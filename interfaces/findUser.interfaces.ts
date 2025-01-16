import {IUser} from "../models/user/user.models";

export interface IFindUser extends IUser {
    email: string;
    password: string;
}