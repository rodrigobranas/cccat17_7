import RideRepository from "../../application/repository/RideRepository";
import Ride from "../../domain/entity/Ride";
import DatabaseConnection from "../database/DatabaseConnection";

export default class RideRepositoryDatabase implements RideRepository {

	constructor (readonly connection: DatabaseConnection) {
	}

	async saveRide(ride: Ride): Promise<void> {
		await this.connection.query("insert into cccat17.ride (ride_id, passenger_id, driver_id, from_lat, from_long, to_lat, to_long, status, date, distance, fare) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", [ride.rideId, ride.passengerId, ride.driverId || null, ride.getFrom().getLat(), ride.getFrom().getLong(), ride.getTo().getLat(), ride.getTo().getLong(), ride.status, ride.date, ride.distance, ride.fare]);
	}
	
	async getRideById(rideId: string): Promise<Ride> {
		const [rideData] = await this.connection.query("select * from cccat17.ride where ride_id = $1", [rideId]);
		if (!rideData) throw new Error();
		return new Ride(rideData.ride_id, rideData.passenger_id, rideData.driver_id, parseFloat(rideData.from_lat), parseFloat(rideData.from_long), parseFloat(rideData.to_lat), parseFloat(rideData.to_long), rideData.status, rideData.date, parseFloat(rideData.distance), parseFloat(rideData.fare));
	}

	async hasActiveRideByPassengerId(passengerId: string): Promise<boolean> {
		const [rideData] = await this.connection.query("select count(*)::int as count from cccat17.ride where passenger_id = $1 and status in ('requested', 'accepted', 'in_progress')", [passengerId]);
		return rideData.count > 0;
	}

	async hasActiveRideByDriverId(driverId: string): Promise<boolean> {
		const [rideData] = await this.connection.query("select count(*)::int as count from cccat17.ride where driver_id = $1 and status in ('accepted',  'in_progress')", [driverId]);
		return rideData.count > 0;
	}

	async updateRide(ride: Ride): Promise<void> {
		await this.connection.query("update cccat17.ride set driver_id = $1, status = $2, distance = $3, fare = $4 where ride_id = $5", [ride.driverId, ride.status, ride.distance, ride.fare, ride.rideId]);
	}

}
