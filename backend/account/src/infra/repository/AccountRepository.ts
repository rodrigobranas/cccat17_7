import AccountRepository from "../../application/repository/AccountRepository";
import Account from "../../domain/entity/Account";
import DatabaseConnection from "../database/DatabaseConnection";

export class AccountRepositoryDatabase implements AccountRepository {

	constructor (readonly connection: DatabaseConnection) {
	}
	
	async getAccountByEmail (email: string): Promise<Account | undefined> {
		const [accountData] = await this.connection.query("select * from cccat17.account where email = $1", [email]);
		if (!accountData) return;
		return new Account(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.car_plate, accountData.is_passenger, accountData.is_driver, accountData.password);
	}
	
	async getAccountById (accountId: string) {
		const [accountData] = await this.connection.query("select * from cccat17.account where account_id = $1", [accountId]);
		if (!accountData) throw new Error("Account not found");
		return new Account(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.car_plate, accountData.is_passenger, accountData.is_driver, accountData.password);
	}

	async list () {
		const accountsData = await this.connection.query("select * from cccat17.account", []);
		const accounts = [];
		for (const accountData of accountsData) {
			accounts.push(new Account(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.car_plate, accountData.is_passenger, accountData.is_driver, accountData.password));
		}
		return accounts;
	}
	
	async saveAccount (account: Account) {
		await this.connection.query("insert into cccat17.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [account.accountId, account.getName(), account.getEmail(), account.getCpf(), account.getCarPlate(), !!account.isPassenger, !!account.isDriver, account.getPassword()]);
	}

}

export class AccountRepositoryMemory implements AccountRepository {
	accounts: Account[];

	constructor () {
		this.accounts = [];
	}

	async getAccountByEmail(email: string): Promise<any> {
		return this.accounts.find((account: Account) => account.getEmail() === email);
	}

	async getAccountById(accountId: string): Promise<any> {
		return this.accounts.find((account: Account) => account.accountId === accountId);
	}

	async saveAccount(account: Account): Promise<void> {
		this.accounts.push(account);
	}

	async list(): Promise<Account[]> {
		return this.accounts;
	}

}
