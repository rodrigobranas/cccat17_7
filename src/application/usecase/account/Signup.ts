import MailerGatewayFake from "../../../infra/gateway/MailerGatewayFake";
import UseCase from "../UseCase";
import Account from "../../../domain/entity/Account";
import MailerGateway from "../../gateway/MailerGateway";
import AccountRepository from "../../repository/AccountRepository";

export default class Signup implements UseCase {
	accountRepository: AccountRepository;
	mailerGateway: MailerGateway;

	// Dependency Injection que viabilizou o princípio de design Dependency Inversion (DIP)
	constructor (accountRepository: AccountRepository, mailerGateway: MailerGateway = new MailerGatewayFake()) {
		this.accountRepository = accountRepository;
		this.mailerGateway = mailerGateway;
	}

	// Dependency Injection
	setAccountRepository (accountRepository: AccountRepository) {
		this.accountRepository = accountRepository;
	}

	async execute (input: Input): Promise<Output> {
		const existingAccount = await this.accountRepository.getAccountByEmail(input.email);
		if (existingAccount) throw new Error("Account already exists");
		const account = Account.create(input.name, input.email, input.cpf, input.carPlate || "", !!input.isPassenger, !!input.isDriver, input.password);
		await this.accountRepository.saveAccount(account);
		await this.mailerGateway.send(account.getEmail(), "Welcome!", "");
		return {
			accountId: account.accountId
		};
	}
	
}

type Input = {
	name: string,
	email: string,
	cpf: string,
	carPlate?: string,
	isPassenger?: boolean,
	isDriver?: boolean,
	password?: string
}

type Output = {
	accountId: string
}
