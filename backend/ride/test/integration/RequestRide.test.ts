import AccountGateway from "../../src/application/gateway/AccountGateway";
import GetRide from "../../src/application/usecase/ride/GetRide";
import RequestRide from "../../src/application/usecase/ride/RequestRide";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import AccountGatewayHttp from "../../src/infra/gateway/AccountGatewayHttp";
import { AxiosAdapter, FetchAdapter } from "../../src/infra/http/HttpClient";
import PositionRepositoryDatabase from "../../src/infra/repository/PositionRepositoryDatabase";
import RideRepositoryDatabase from "../../src/infra/repository/RideRepositoryDatabase";

let connection: DatabaseConnection;
let requestRide: RequestRide;
let getRide: GetRide;
let accountGateway: AccountGateway;

beforeEach(() => {
	connection = new PgPromiseAdapter();
	const rideRepository = new RideRepositoryDatabase(connection);
	const positionRepository = new PositionRepositoryDatabase(connection);
	const httpClient = new AxiosAdapter();
	// const httpClient = new FetchAdapter();
	accountGateway = new AccountGatewayHttp(httpClient);
	requestRide = new RequestRide(rideRepository, accountGateway);
	getRide = new GetRide(rideRepository, accountGateway, positionRepository);
});

test("Deve solicitar uma corrida", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	}
	const outputSignup = await accountGateway.signup(inputSignup);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	expect(outputRequestRide.rideId).toBeDefined();
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
	expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
	expect(outputGetRide.passengerName).toBe("John Doe");
	expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat);
	expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong);
	expect(outputGetRide.toLat).toBe(inputRequestRide.toLat);
	expect(outputGetRide.toLong).toBe(inputRequestRide.toLong);
	expect(outputGetRide.status).toBe("requested");
});

test("Não deve poder solicitar uma corrida se a conta não for de um passageiro", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isPassenger: false,
		isDriver: true
	}
	const outputSignup = await accountGateway.signup(inputSignup);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	}
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("This account is not from passenger"));
});

test("Não deve poder solicitar uma corrida se o passageiro já tiver outra corrida não finalizada", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	}
	const outputSignup = await accountGateway.signup(inputSignup);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	}
	await requestRide.execute(inputRequestRide);
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("This passenger has an active ride"));
});

afterEach(async () => {
	await connection.close();
});
