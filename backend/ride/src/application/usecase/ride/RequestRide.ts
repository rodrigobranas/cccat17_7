import Ride from "../../../domain/entity/Ride";
import AccountGateway from "../../gateway/AccountGateway";
import RideRepository from "../../repository/RideRepository";
import UseCase from "../UseCase";

export default class RequestRide implements UseCase {

	constructor (readonly rideRepository: RideRepository, readonly accountGateway: AccountGateway) {
	}

	async execute(input: Input): Promise<Output> {
		// application business rules
		const account = await this.accountGateway.getAccountById(input.passengerId);
		if (!account.isPassenger) throw new Error("This account is not from passenger");
		const hasActiveRide = await this.rideRepository.hasActiveRideByPassengerId(input.passengerId);
		if (hasActiveRide) throw new Error("This passenger has an active ride");
		//
		// enterprise business rules
		const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
		//
		await this.rideRepository.saveRide(ride);
		return {
			rideId: ride.rideId
		}
	}

}

type Input = {
	passengerId: string,
	fromLat: number,
	fromLong: number,
	toLat: number,
	toLong: number
}

type Output = {
	rideId: string
}
