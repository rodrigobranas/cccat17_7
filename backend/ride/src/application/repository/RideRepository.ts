import Ride from "../../domain/entity/Ride";

export default interface RideRepository {
	saveRide (ride: Ride): Promise<void>;
	getRideById (rideId: string): Promise<Ride>;
	hasActiveRideByPassengerId (passengerId: string): Promise<boolean>;
	hasActiveRideByDriverId (driverId: string): Promise<boolean>;
	updateRide (ride: Ride): Promise<void>;
}
