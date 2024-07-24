import Coord from "./Coord";

export default class Segment {
	from: Coord;
	to: Coord;

	constructor (from: Coord, to: Coord) {
		if (!from || !to) throw new Error("Invalid segment");
		this.from = from;
		this.to = to;
	}

	getDistance () {
		const earthRadius = 6371;
		const degreesToRadians = Math.PI / 180;
		const deltaLat = (this.to.getLat() - this.from.getLat()) * degreesToRadians;
		const deltaLon = (this.to.getLong() - this.from.getLong()) * degreesToRadians;
		const a =
			Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
			Math.cos(this.from.getLat() * degreesToRadians) *
			Math.cos(this.to.getLat() * degreesToRadians) *
			Math.sin(deltaLon / 2) *
			Math.sin(deltaLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = earthRadius * c;
		return Math.round(distance);
	}
}
