import Ride from "../../../domain/entity/Ride";
import AccountRepository from "../../repository/AccountRepository";
import RideRepository from "../../repository/RideRepository";
import UseCase from "../UseCase";

export default class AcceptRide implements UseCase {

	constructor (readonly rideRepository: RideRepository, readonly accountRepository: AccountRepository) {
	}

	async execute(input: Input): Promise<void> {
		// application business rules
		const account = await this.accountRepository.getAccountById(input.driverId);
		if (!account.isDriver) throw new Error();
		// enterprise business rules
		const ride = await this.rideRepository.getRideById(input.rideId);
		ride.accept(input.driverId);
		await this.rideRepository.saveRide(ride);
	}

}

type Input = {
	rideId: string,
	driverId: string
}
