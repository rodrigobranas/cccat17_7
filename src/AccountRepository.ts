import Account from "./Account";
import DatabaseConnection from "./DatabaseConnection";

export default interface AccountRepository {
	getAccountByEmail (email: string): Promise<Account | undefined>;
	getAccountById (accountId: string): Promise<Account>;
	saveAccount (account: Account): Promise<void>;
	list (): Promise<Account[]>;
}

export class AccountRepositoryDatabase implements AccountRepository {

	constructor (readonly connection: DatabaseConnection) {
	}
	
	async getAccountByEmail (email: string): Promise<Account | undefined> {
		const [accountData] = await this.connection.query("select * from cccat17.account where email = $1", [email]);
		if (!accountData) return;
		return new Account(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.car_plate, accountData.is_passenger, accountData.is_driver);
	}
	
	async getAccountById (accountId: string) {
		const [accountData] = await this.connection.query("select * from cccat17.account where account_id = $1", [accountId]);
		if (!accountData) throw new Error("Account not found");
		return new Account(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.car_plate, accountData.is_passenger, accountData.is_driver);
	}

	async list () {
		const accountsData = await this.connection.query("select * from cccat17.account", []);
		const accounts = [];
		for (const accountData of accountsData) {
			accounts.push(new Account(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.car_plate, accountData.is_passenger, accountData.is_driver));
		}
		return accounts;
	}
	
	async saveAccount (account: Account) {
		await this.connection.query("insert into cccat17.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [account.accountId, account.name, account.email, account.getCpf(), account.carPlate, !!account.isPassenger, !!account.isDriver]);
	}

}

export class AccountRepositoryMemory implements AccountRepository {
	accounts: Account[];

	constructor () {
		this.accounts = [];
	}

	async getAccountByEmail(email: string): Promise<any> {
		return this.accounts.find((account: Account) => account.email === email);
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
