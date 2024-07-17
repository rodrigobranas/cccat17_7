import AccountRepository from "../../repository/AccountRepository";
import PositionRepository from "../../repository/PositionRepository";
import RideRepository from "../../repository/RideRepository";
import UseCase from "../UseCase";

export default class GetRide implements UseCase {

	constructor (readonly rideRepository: RideRepository, readonly accountRepository: AccountRepository, readonly positionRepository: PositionRepository) {
	}

	async execute(rideId: string): Promise<Output> {
		const ride = await this.rideRepository.getRideById(rideId);
		const passenger = await this.accountRepository.getAccountById(ride.passengerId);
		const lastPosition = await this.positionRepository.getLastPositionFromRideId(rideId);
		return {
			rideId: ride.rideId,
			passengerId: ride.passengerId,
			driverId: ride.driverId,
			passengerName: passenger.getName(),
			fromLat: ride.getFrom().getLat(),
			fromLong: ride.getFrom().getLong(),
			toLat: ride.getTo().getLat(),
			toLong: ride.getTo().getLong(),
			status: ride.status,
			date: ride.date,
			currentLat: lastPosition?.lat,
			currentLong: lastPosition?.long,
			distance: ride.distance,
			fare: ride.fare
		};
	}

}

type Output = {
	rideId: string,
	passengerId: string,
	driverId: string,
	passengerName: string,
	fromLat: number,
	fromLong: number,
	toLat: number,
	toLong: number,
	status: string,
	date: Date,
	currentLat?: number,
	currentLong?: number,
	distance: number,
	fare: number
}
