export default class ProcessPayment {

	constructor () {
	}

	async execute (input: Input): Promise<void> {
		console.log("processPayment", input);
	}
}

type Input = {
	rideId: string,
	amount: number
}