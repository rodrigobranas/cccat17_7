import MailerGateway from "../../src/application/gateway/MailerGateway";
import GetAccount from "../../src/application/usecase/account/GetAccount";
import Signup from "../../src/application/usecase/account/Signup";
import Account from "../../src/domain/entity/Account";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import MailerGatewayFake from "../../src/infra/gateway/MailerGatewayFake";
import { AccountRepositoryDatabase, AccountRepositoryMemory } from "../../src/infra/repository/AccountRepository";
import sinon from "sinon";

let connection: DatabaseConnection;
let signup: Signup;
let getAccount: GetAccount;
let mailerGateway: MailerGateway;

beforeEach(() => {
	connection = new PgPromiseAdapter();
	const accountRepository = new AccountRepositoryDatabase(connection);
	mailerGateway = new MailerGatewayFake();
	signup = new Signup(accountRepository, mailerGateway);
	getAccount = new GetAccount(accountRepository);
});

test("Deve criar uma conta de passageiro", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	}
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
	expect(outputGetAccount.password).toBe(inputSignup.password);
});

test("Deve criar uma conta de motorista", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isDriver: true
	}
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
	expect(outputGetAccount.carPlate).toBe(inputSignup.carPlate);
});

test("Não deve criar uma conta de passageiro com nome inválido", async function () {
	const input = {
		name: "",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	}
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar uma conta de passageiro com email inválido", async function () {
	signup = new Signup(new AccountRepositoryMemory());
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}`,
		cpf: "97456321558",
		isPassenger: true
	}
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve criar uma conta de passageiro com cpf inválido", async function () {
	signup = new Signup(new AccountRepositoryMemory());
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "9745632155810",
		isPassenger: true
	}
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Não deve criar uma conta de passageiro com email duplicado", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	}
	await signup.execute(input)
	await expect(() => signup.execute(input)).rejects.toThrowError("Account already exists");
});

test("Não deve criar uma conta de motorista com a placa inválida", async function () {
	signup = new Signup(new AccountRepositoryMemory());
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA999",
		isDriver: true
	}
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid car plate"));

});

test("Deve criar uma conta de passageiro com stub do MailerGateway", async function () {
	const stub = sinon.stub(MailerGatewayFake.prototype, "send").resolves();
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	}
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
	stub.restore();
});

test("Deve criar uma conta de passageiro com stub do AccountRepository", async function () {
	const email = `john.doe${Math.random()}@gmail.com`;
	const inputSignup = {
		name: "John Doe",
		email,
		cpf: "97456321558",
		isPassenger: true
	}
	const inputSignupStub = Account.create("John Doe", email, "97456321558", "", true, false);
	const stubSaveAccount = sinon.stub(AccountRepositoryDatabase.prototype, "saveAccount").resolves();
	const stubGetAccountByEmail = sinon.stub(AccountRepositoryDatabase.prototype, "getAccountByEmail").resolves(undefined);
	const stubGetAccountById = sinon.stub(AccountRepositoryDatabase.prototype, "getAccountById").resolves(inputSignupStub);
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
	stubSaveAccount.restore();
	stubGetAccountByEmail.restore();
	stubGetAccountById.restore();
});

test("Deve criar uma conta de passageiro com fake do AccountRepository", async function () {
	const accountRepository = new AccountRepositoryMemory();
	signup = new Signup(accountRepository);
	getAccount = new GetAccount(accountRepository);
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	}
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
});

test("Deve criar uma conta de passageiro com spy no MailerGateway", async function () {
	const spySend = sinon.spy(MailerGatewayFake.prototype, "send");
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	}
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
	expect(spySend.calledOnce).toBe(true);
	expect(spySend.calledWith(inputSignup.email, "Welcome!", "")).toBe(true);
	spySend.restore();
});

test("Deve criar uma conta de passageiro com mock no MailerGateway", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	}
	const mockMailerGateway = sinon.mock(MailerGatewayFake.prototype);
	mockMailerGateway.expects("send").withArgs(inputSignup.email, "Welcome!", "").once().callsFake(() => {
		console.log("abc");
	});
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
	mockMailerGateway.verify();
	mockMailerGateway.restore();
});

afterEach(async () => {
	await connection.close();
});
