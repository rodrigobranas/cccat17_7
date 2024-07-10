import Account from "../../domain/entity/Account";

export default interface AccountRepository {
	getAccountByEmail (email: string): Promise<Account | undefined>;
	getAccountById (accountId: string): Promise<Account>;
	saveAccount (account: Account): Promise<void>;
	list (): Promise<Account[]>;
}
