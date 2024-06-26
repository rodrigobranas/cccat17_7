import express from "express";
import AccountService from "./application";

export default class API {
	app: any;
	accountService: AccountService;

	constructor (accountService: AccountService) {
		this.app = express();
		this.app.use(express.json());
		this.accountService = accountService;
	}

	build () {
		this.app.post("/signup", async (req: any, res: any) => {
			const input = req.body;
			try {
				const output = await this.accountService.signup(input);
				res.json(output);
			} catch (e: any) {
				res.status(422).json({
					message: e.message
				});
			}
		});
		
		this.app.get("/accounts/:accountId", async (req: any, res: any) => {
			const accountId = req.params.accountId;
			const output = await this.accountService.getAccount(accountId);
			res.json(output);
		});
		
		
	}

	start () {
		this.app.listen(3000);
	}
}
