import Ride from "../../../domain/entity/Ride";
import RideRepository from "../../repository/RideRepository";
import UseCase from "../UseCase";

export default class GetRide implements UseCase {

	constructor (readonly rideRepository: RideRepository) {
	}

	async execute(rideId: string): Promise<Output> {
		const ride = await this.rideRepository.getRideById(rideId);
		return {
			rideId: ride.rideId,
			passengerId: ride.passengerId,
			fromLat: ride.getFrom().getLat(),
			fromLong: ride.getFrom().getLong(),
			toLat: ride.getTo().getLat(),
			toLong: ride.getTo().getLong(),
			status: ride.status,
			date: ride.date
		};
	}

}

type Output = {
	rideId: string,
	passengerId: string,
	fromLat: number,
	fromLong: number,
	toLat: number,
	toLong: number,
	status: string,
	date: Date
}
