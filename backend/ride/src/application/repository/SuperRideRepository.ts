import Ride from "../../domain/entity/Ride";
import SuperRide from "../../domain/entity/SuperRide";

export default interface RideRepository {
	saveRide (ride: Ride): Promise<void>;
	getRideById (rideId: string): Promise<SuperRide>;
}
