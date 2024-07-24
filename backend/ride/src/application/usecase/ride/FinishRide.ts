import RideRepository from "../../repository/RideRepository";
import ProcessPayment from "../payment/ProcessPayment";
import UseCase from "../UseCase";

export default class StartRide implements UseCase {

	constructor (readonly rideRepository: RideRepository) {
	}

	async execute(input: Input): Promise<void> {
		const ride = await this.rideRepository.getRideById(input.rideId);
		ride.finish();
		await this.rideRepository.updateRide(ride);
		const processPayment = new ProcessPayment();
		await processPayment.execute({ rideId: ride.rideId, amount: ride.fare });
	}

}

type Input = {
	rideId: string
}
