import { Role, Security } from "@prisma/client";
import { UserDto } from "../dtos/user.dto";

export interface IUser extends UserDto {
	userId?: string;
	roles?: Role[];
	phone?: string;
	security?: Security;
}
