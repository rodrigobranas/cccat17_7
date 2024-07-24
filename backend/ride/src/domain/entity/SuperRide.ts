import crypto from "crypto";
import Coord from "../vo/Coord";
import Account from "./Account";

export default class SuperRide {
	private from: Coord;
	private to: Coord;

	constructor (readonly rideId: string, readonly passenger: Account, readonly driver: Account | null, fromLat: number, fromLong: number, toLat: number, toLong: number, readonly status: string, readonly date: Date) {
		this.from = new Coord(fromLat, fromLong);
		this.to = new Coord(toLat, toLong);
	}

	static create (passenger: Account, fromLat: number, fromLong: number, toLat: number, toLong: number) {
		const rideId = crypto.randomUUID();
		const status = "requested";
		const date = new Date();
		return new SuperRide(rideId, passenger, null, fromLat, fromLong, toLat, toLong, status, date);
	}

	getFrom () {
		return this.from;
	}

	getTo () {
		return this.to;
	}

	getPassengerName () {
		return this.passenger.getName();
	}
}
