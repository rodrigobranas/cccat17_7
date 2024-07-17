import Ride from "../../../domain/entity/Ride";
import AccountRepository from "../../repository/AccountRepository";
import RideRepository from "../../repository/RideRepository";
import UseCase from "../UseCase";

export default class StartRide implements UseCase {

	constructor (readonly rideRepository: RideRepository) {
	}

	async execute(input: Input): Promise<void> {
		const ride = await this.rideRepository.getRideById(input.rideId);
		ride.start();
		await this.rideRepository.updateRide(ride);
	}

}

type Input = {
	rideId: string
}
