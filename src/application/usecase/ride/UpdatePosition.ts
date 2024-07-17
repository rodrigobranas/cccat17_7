import Position from "../../../domain/entity/Position";
import Ride from "../../../domain/entity/Ride";
import DistanceCalculator from "../../../domain/service/DistanceCalculator";
import Segment from "../../../domain/vo/Segment";
import AccountRepository from "../../repository/AccountRepository";
import PositionRepository from "../../repository/PositionRepository";
import RideRepository from "../../repository/RideRepository";
import UseCase from "../UseCase";

export default class UpdatePosition implements UseCase {

	constructor (readonly rideRepository: RideRepository, readonly positionRepository: PositionRepository) {
	}

	async execute(input: Input): Promise<void> {
		const ride = await this.rideRepository.getRideById(input.rideId);
		const position = Position.create(input.rideId, input.lat, input.long, input.date);
		const lastPosition = await this.positionRepository.getLastPositionFromRideId(input.rideId);
		if (lastPosition) ride.updatePosition(lastPosition, position);
		await this.positionRepository.savePosition(position);
		await this.rideRepository.updateRide(ride);
	}

}

type Input = {
	rideId: string,
	lat: number,
	long: number,
	date: Date
}
