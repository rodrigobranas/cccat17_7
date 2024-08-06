import AccountGateway from "../../src/application/gateway/AccountGateway";
import AcceptRide from "../../src/application/usecase/ride/AcceptRide";
import GetRide from "../../src/application/usecase/ride/GetRide";
import RequestRide from "../../src/application/usecase/ride/RequestRide";
import StartRide from "../../src/application/usecase/ride/StartRide";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import AccountGatewayHttp from "../../src/infra/gateway/AccountGatewayHttp";
import { AxiosAdapter } from "../../src/infra/http/HttpClient";
import PositionRepositoryDatabase from "../../src/infra/repository/PositionRepositoryDatabase";
import RideRepositoryDatabase from "../../src/infra/repository/RideRepositoryDatabase";

let connection: DatabaseConnection;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let accountGateway: AccountGateway;

beforeEach(() => {
	connection = new PgPromiseAdapter();
	const clientHttp = new AxiosAdapter();
	accountGateway = new AccountGatewayHttp(clientHttp);
	const rideRepository = new RideRepositoryDatabase(connection);
	const positionRepository = new PositionRepositoryDatabase(connection);
	requestRide = new RequestRide(rideRepository, accountGateway);
	getRide = new GetRide(rideRepository, accountGateway, positionRepository);
	acceptRide = new AcceptRide(rideRepository, accountGateway);
	startRide = new StartRide(rideRepository);
});

test("Deve iniciar uma corrida", async function () {
	const inputSignupPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	}
	const outputSignupPassenger = await accountGateway.signup(inputSignupPassenger);
	const inputRequestRide = {
		passengerId: outputSignupPassenger.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	const inputSignupDriver = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isDriver: true
	}
	const outputSignupDriver = await accountGateway.signup(inputSignupDriver);
	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignupDriver.accountId
	}
	await acceptRide.execute(inputAcceptRide);
	const inputStartRide = {
		rideId: outputRequestRide.rideId
	}
	await startRide.execute(inputStartRide);
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.status).toBe("in_progress");
});

afterEach(async () => {
	await connection.close();
});
