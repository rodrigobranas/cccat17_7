import RideCompletedEvent from "../../../domain/event/RideCompletedEvent";
import Mediator from "../../../infra/mediator/Mediator";
import Queue from "../../../infra/queue/Queue";
import PaymentGateway from "../../gateway/PaymentGateway";
import RideRepository from "../../repository/RideRepository";
import UseCase from "../UseCase";

export default class FinishRide implements UseCase {

	constructor (readonly rideRepository: RideRepository, readonly mediator: Mediator, readonly paymentGateway: PaymentGateway, readonly queue: Queue) {
	}

	async execute(input: Input): Promise<void> {
		const ride = await this.rideRepository.getRideById(input.rideId);
		ride.register("rideCompleted", async (event: RideCompletedEvent) => {
			// this.mediator.notify("rideCompleted", event);
			// await this.paymentGateway.processPayment(event);
			await this.queue.publish("rideCompleted", event);
		});
		ride.finish();
		await this.rideRepository.updateRide(ride);
		
	}

}

type Input = {
	rideId: string
}
