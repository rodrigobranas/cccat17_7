export default class GenerateInvoice {

	constructor () {
	}

	async execute (input: Input): Promise<void> {
		console.log("generateInvoice", input);
	}
}

type Input = {
	rideId: string,
	amount: number
}