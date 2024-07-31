import ProcessPayment from "../../application/usecase/payment/ProcessPayment";
import Queue from "../queue/Queue";

export default class QueueController {

	constructor (readonly queue: Queue, readonly processPayment: ProcessPayment) {
		queue.consume("rideCompleted.processPayment", async (input: any) => {
			await processPayment.execute(input);
		});
	}
}