import RequestRide from "../../application/usecase/ride/RequestRide";
import Queue from "../queue/Queue";

export default class QueueController {

	constructor (readonly queue: Queue, readonly requestRide: RequestRide) {
		queue.consume("requestRide", async (input: any) => {
			await requestRide.execute(input);
		});
	}
}