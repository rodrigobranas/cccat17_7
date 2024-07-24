import MailerGatewayFake from "../../../infra/gateway/MailerGatewayFake";
import UseCase from "../UseCase";
import Account from "../../../domain/entity/Account";
import MailerGateway from "../../gateway/MailerGateway";

export default class Signup implements UseCase {
	accountRepository: AccountRepositorySignup;
	mailerGateway: MailerGateway;

	constructor (accountRepository: AccountRepositorySignup, mailerGateway: MailerGateway = new MailerGatewayFake()) {
		this.accountRepository = accountRepository;
		this.mailerGateway = mailerGateway;
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

// ISP - Interface Segregation Principle
export interface AccountRepositorySignup {
	getAccountByEmail (email: string): Promise<Account | undefined>;
	saveAccount (account: Account): Promise<void>;
}