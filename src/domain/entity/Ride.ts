import crypto from "crypto";
import Coord from "../vo/Coord";

// Entity, forma um Aggregate liderado por Ride (root) que contém Coord 
export default class Ride {
	private from: Coord;
	private to: Coord;

	constructor (readonly rideId: string, readonly passengerId: string, public driverId: string, fromLat: number, fromLong: number, toLat: number, toLong: number, public status: string, readonly date: Date) {
		this.from = new Coord(fromLat, fromLong);
		this.to = new Coord(toLat, toLong);
	}

	static create (passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
		const rideId = crypto.randomUUID();
		const status = "requested";
		const date = new Date();
		return new Ride(rideId, passengerId, "", fromLat, fromLong, toLat, toLong, status, date);
	}

	getFrom () {
		return this.from;
	}

	getTo () {
		return this.to;
	}

	accept (driverId: string) {
		if (this.status !== "requested" || driverId) throw new Error("");
		this.driverId = driverId;
		this.status = "accepted";
	}
}
