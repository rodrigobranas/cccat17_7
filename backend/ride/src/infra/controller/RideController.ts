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
		// volume muito grande de requisições, que tenham muitas dependências para outros microservices...
		// + escalabilidade, resiliência, independência
		// command/handler
		httpServer.register("post", "/request_ride_async", async (params: any, body: any) => {
			// command - intenção de executar
			await queue.publish("requestRide", body);
		});
	}
}
