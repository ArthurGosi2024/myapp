import {IUser} from "../models/user/user.models";

export interface IUpdateUser extends Omit<IUser, "security" | "dateOfBirth">{

}