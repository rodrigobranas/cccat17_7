import Account from "../../src/domain/entity/Account";
import Position from "../../src/domain/entity/Position";
import Ride from "../../src/domain/entity/Ride";

test("Não deve criar uma corrida com coordenada inválida", function () {
	expect(() => Ride.create("", -180, 180, -180, 180)).toThrow(new Error("Invalid latitude"));
});

test("Deve calcular a distância da corrida", function () {
	const ride = Ride.create("", 0, 0, 0, 0);
	const account = Account.create("John Doe", "john.doe@gmail.com", "97456321558", "AAA9999", false, true);
	ride.accept(account);
	ride.start();
	const lastPosition = Position.create("", -27.584905257808835, -48.545022195325124);
	const currentPosition = Position.create("", -27.496887588317275, -48.522234807851476);
	ride.updatePosition(lastPosition, currentPosition);
	expect(ride.distance).toBe(10);
});