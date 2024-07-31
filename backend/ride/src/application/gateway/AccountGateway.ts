export default interface AccountGateway {
	signup (input: Input): Promise<Output>;
	getAccountById (accountId: string): Promise<any>;
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