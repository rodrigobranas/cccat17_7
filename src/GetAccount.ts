import UseCase from "./UseCase";
import AccountRepository from "./AccountRepository";

export default class GetAccount implements UseCase {
	accountRepository: AccountRepository;

	constructor (accountRepository: AccountRepository) {
		this.accountRepository = accountRepository;
	}
	
	async execute (accountId: any): Promise<Output> {
		const account = await this.accountRepository.getAccountById(accountId);
		return {
			accountId: account.accountId,
			name: account.name,
			email: account.email,
			cpf: account.getCpf(),
			carPlate: account.carPlate,
			isPassenger: account.isPassenger,
			isDriver: account.isDriver
		};
	}
}

type Output = {
	accountId: string,
	name: string,
	email: string,
	cpf: string,
	carPlate: string,
	isPassenger: boolean,
	isDriver: boolean
}
