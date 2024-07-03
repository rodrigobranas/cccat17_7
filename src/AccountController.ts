import Signup from "./Signup";
import GetAccount from "./GetAccount";
import HttpServer from "./HttpServer";

export default class AccountController {

	constructor (readonly httpServer: HttpServer, readonly signup: Signup, readonly getAccount: GetAccount) {
		this.httpServer.register("post", "/signup", async (params: any, body: any) => {
			const input = body;
			const output = await this.signup.execute(input);
			return output;
		});
		
		this.httpServer.register("get", "/accounts/:{accountId}", async (params: any, body: any) => {
			const accountId = params.accountId;
			const output = await this.getAccount.execute(accountId);
			return output;
		});
	}
	
}
