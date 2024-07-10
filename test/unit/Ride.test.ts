import Ride from "../../src/domain/entity/Ride";

test("Não deve criar uma corrida com coordenada inválida", function () {
	expect(() => Ride.create("", -180, 180, -180, 180)).toThrow(new Error("Invalid latitude"));
});
