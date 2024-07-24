import Cpf from "../../src/domain/vo/Cpf";

test.each([
	"97456321558",
	"71428793860",
	"87748248800"
])("Deve testar se o cpf é válido %s", function (cpf: string) {
	expect(new Cpf(cpf)).toBeDefined();
});

test.each([
	"",
	null,
	undefined,
	"123456",
	"12345678901234567890",
	"11111111111"
])("Deve testar se o cpf é inválido %s", function (cpf: any) {
	expect(() => new Cpf(cpf)).toThrow(new Error("Invalid cpf"));
});
