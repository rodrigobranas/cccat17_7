import Position from "../../domain/entity/Position";

export default interface PositionRepository {
	savePosition (position: Position): Promise<void>;
	getLastPositionFromRideId (rideId: string): Promise<Position | undefined>;
}
