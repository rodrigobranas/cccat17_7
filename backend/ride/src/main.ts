import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter, HapiAdapter } from "./infra/http/HttpServer";
import Registry from "./infra/di/Registry";
import RideController from "./infra/controller/RideController";
import RequestRide from "./application/usecase/ride/RequestRide";
import RideRepositoryDatabase from "./infra/repository/RideRepositoryDatabase";
import { AxiosAdapter } from "./infra/http/HttpClient";
import AccountGatewayHttp from "./infra/gateway/AccountGatewayHttp";
import { RabbitMQAdapter } from "./infra/queue/Queue";

(async () => {
	const connection = new PgPromiseAdapter();
	const httpServer = new ExpressAdapter();
	// const httpServer = new HapiAdapter();
	const rideRepository = new RideRepositoryDatabase(connection);
	const httpClient = new AxiosAdapter();
	const accountGateway = new AccountGatewayHttp(httpClient);
	const requestRide = new RequestRide(rideRepository, accountGateway);
	const queue = new RabbitMQAdapter();
	await queue.connect();
	await queue.setup("rideCompleted", "rideCompleted.processPayment");
	new RideController(httpServer, requestRide, queue);
	httpServer.listen(3000);
})();
