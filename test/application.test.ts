import MailerGateway from "../src/MailerGateway";
import AccountService, { AccountServiceProduction } from "../src/application";
import { AccountDAODatabase, AccountDAOMemory } from "../src/resource";
import sinon from "sinon";

let accountService: AccountService;

beforeEach(() => {
	const accountDAO = new AccountDAODatabase();
	accountService = new AccountServiceProduction(accountDAO);
});

test("Deve criar uma conta de passageiro", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	}
	const outputSignup = await accountService.signup(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
});

test("Deve criar uma conta de motorista", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isDriver: true
	}
	const outputSignup = await accountService.signup(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
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
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar uma conta de passageiro com email inválido", async function () {
	accountService = new AccountServiceProduction(new AccountDAOMemory());
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}`,
		cpf: "97456321558",
		isPassenger: true
	}
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve criar uma conta de passageiro com cpf inválido", async function () {
	accountService = new AccountServiceProduction(new AccountDAOMemory());
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "9745632155810",
		isPassenger: true
	}
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Não deve criar uma conta de passageiro com email duplicado", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	}
	await accountService.signup(input)
	await expect(() => accountService.signup(input)).rejects.toThrowError("Account already exists");
});

test("Não deve criar uma conta de motorista com a placa inválida", async function () {
	accountService = new AccountServiceProduction(new AccountDAOMemory());
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA999",
		isDriver: true
	}
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid car plate"));

});

test("Deve criar uma conta de passageiro com stub do MailerGateway", async function () {
	const stub = sinon.stub(MailerGateway.prototype, "send").resolves();
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	}
	const outputSignup = await accountService.signup(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
	stub.restore();
});

test("Deve criar uma conta de passageiro com stub do AccountDAO", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	}
	const stubSaveAccount = sinon.stub(AccountDAODatabase.prototype, "saveAccount").resolves();
	const stubGetAccountByEmail = sinon.stub(AccountDAODatabase.prototype, "getAccountByEmail").resolves(undefined);
	const stubGetAccountById = sinon.stub(AccountDAODatabase.prototype, "getAccountById").resolves(inputSignup);
	const outputSignup = await accountService.signup(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
	stubSaveAccount.restore();
	stubGetAccountByEmail.restore();
	stubGetAccountById.restore();
});

test("Deve criar uma conta de passageiro com fake do AccountDAO", async function () {
	accountService = new AccountServiceProduction(new AccountDAOMemory());
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	}
	const outputSignup = await accountService.signup(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
});

test("Deve criar uma conta de passageiro com spy no MailerGateway", async function () {
	const spySend = sinon.spy(MailerGateway.prototype, "send");
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	}
	const outputSignup = await accountService.signup(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
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
	const mockMailerGateway = sinon.mock(MailerGateway.prototype);
	mockMailerGateway.expects("send").withArgs(inputSignup.email, "Welcome!", "").once().callsFake(() => {
		console.log("abc");
	});
	const outputSignup = await accountService.signup(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
	mockMailerGateway.verify();
	mockMailerGateway.restore();
});
