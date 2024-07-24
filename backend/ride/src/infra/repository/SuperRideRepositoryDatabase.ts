import RideRepository from "../../application/repository/RideRepository";
import SuperRideRepository from "../../application/repository/SuperRideRepository";
import Account from "../../domain/entity/Account";
import Ride from "../../domain/entity/Ride";
import SuperRide from "../../domain/entity/SuperRide";
import DatabaseConnection from "../database/DatabaseConnection";

export default class SuperRideRepositoryDatabase implements SuperRideRepository {

	constructor (readonly connection: DatabaseConnection) {
	}

	async saveRide(ride: Ride): Promise<void> {
		await this.connection.query("insert into cccat17.ride (ride_id, passenger_id, driver_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [ride.rideId, ride.passengerId, ride.driverId || null, ride.getFrom().getLat(), ride.getFrom().getLong(), ride.getTo().getLat(), ride.getTo().getLong(), ride.status, ride.date]);
	}
	
	async getRideById(rideId: string): Promise<SuperRide> {
		const [rideData] = await this.connection.query("select * from cccat17.ride where ride_id = $1", [rideId]);
		const [accountData] = await this.connection.query("select * from cccat17.account where account_id = $1", [rideData.passenger_id]);
		if (!rideData) throw new Error();
		const passenger = new Account(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.car_plate, accountData.is_passenger, accountData.is_driver);
		return new SuperRide(rideData.ride_id, passenger, rideData.driver_id, parseFloat(rideData.from_lat), parseFloat(rideData.from_long), parseFloat(rideData.to_lat), parseFloat(rideData.to_long), rideData.status, rideData.date);
	}

}
