import { IContractServiceCrudGenerics } from "../../interfaces/contractCrudGenerics.interfaces";
import { UserRepository } from "../../repository/user/user.repository";
import { CryptoHelper } from "../../helpers/crypto.helper";
import { IFindUser } from "../../interfaces/findUser.interfaces";
import { IDeleteUser } from "../../interfaces/deleteUser.interfaces";
import { IUser } from "../../interfaces/user.interfaces";

export class UserService implements IContractServiceCrudGenerics<IUser> {
	private readonly userRepository: UserRepository | null = null;

	constructor() {
		this.userRepository = new UserRepository();
	}

	async delete(data: IDeleteUser): Promise<boolean> {
		const findUser = await this.userRepository.findBy({ email: data.email });

		if (findUser) {
			await this.userRepository.delete({ email: data.email });
			return true;
		}
		return false;
	}

	async insert(data: IUser): Promise<boolean> {
		const existsUser = await this.findBy({ email: data.email });

		if (existsUser) {
			return false;
		}

		data.password = CryptoHelper.encrypt(data.password);
		await this.userRepository.insert(data);
		return true;
	}

	update(data: Partial<IUser>, newData: Partial<IUser>): void {
		this.userRepository.update(
			{
				email: data.email,
			},
			newData
		);
	}

	async findBy(data: Partial<IUser>): Promise<IUser> {
		return await this.userRepository.findBy({ email: data.email });
	}
}
