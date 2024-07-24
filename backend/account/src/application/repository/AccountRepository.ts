import Account from "../../domain/entity/Account";
import { AccountRepositorySignup } from "../usecase/account/Signup";

export default interface AccountRepository extends AccountRepositorySignup {
	getAccountByEmail (email: string): Promise<Account | undefined>;
	getAccountById (accountId: string): Promise<Account>;
	saveAccount (account: Account): Promise<void>;
	list (): Promise<Account[]>;
}
