import Account from "../../src/domain/entity/Account";

test("Deve criar uma account com senha plain", function () {
	const account = Account.create("John Doe", "john.doe@gmail.com", "97456321558", "AAA9999", false, true, "123456", "plain");
	console.log("plain", account);
	expect(account.verifyPassword("123456")).toBe(true);
});

test("Deve criar uma account com senha md5", function () {
	const account = Account.create("John Doe", "john.doe@gmail.com", "97456321558", "AAA9999", false, true, "123456", "md5");
	console.log("md5", account);
	expect(account.verifyPassword("123456")).toBe(true);
});

test("Deve criar uma account com senha sha1", function () {
	const account = Account.create("John Doe", "john.doe@gmail.com", "97456321558", "AAA9999", false, true, "123456", "sha1");
	console.log("sha1", account);
	expect(account.verifyPassword("123456")).toBe(true);
});


test("Deve criar uma account com senha sha256", function () {
	const account = Account.create("John Doe", "john.doe@gmail.com", "97456321558", "AAA9999", false, true, "123456", "sha256");
	console.log("sha256", account);
	expect(account.verifyPassword("123456")).toBe(true);
});
