export default interface AccountGateway {
	signup (input: any): Promise<any>;
	getAccountById (accountId: string): Promise<any>;
}
