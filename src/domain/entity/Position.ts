import crypto from "crypto";
import Coord from "../vo/Coord";

export default class Position {
	coord: Coord;

	constructor (readonly positionId: string, readonly rideId: string, readonly lat: number, readonly long: number, readonly date: Date) {
		this.coord = new Coord(lat, long);
	}

	static create (rideId: string, lat: number, long: number, date: Date = new Date()) {
		const positionId = crypto.randomUUID();
		return new Position(positionId, rideId, lat, long, date);	
	}
}