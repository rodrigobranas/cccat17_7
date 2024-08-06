import RequestRide from "../../application/usecase/ride/RequestRide";
import HttpServer from "../http/HttpServer";
import Queue from "../queue/Queue";

export default class RideController {

	constructor (readonly httpServer: HttpServer, readonly requestRide: RequestRide, readonly queue: Queue) {
		httpServer.register("post", "/request_ride", async (params: any, body: any) => {
			const response = await requestRide.execute(body);
			console.log(response);
			return response;
		});
	}
}
