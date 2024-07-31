import Coord from "../../src/domain/vo/Coord";

test("Deve criar uma coordenada válida", function () {
	const coord = new Coord(90, 180);
	expect(coord).toBeDefined();
	expect(coord.getLat()).toBe(90);
	expect(coord.getLong()).toBe(180);
});

test("Não deve criar uma coordenada com latitude inválida", function () {
	expect(() => new Coord(-180, 180)).toThrow("Invalid latitude");
});

test("Não deve criar uma coordenada com longitude inválida inválida", function () {
	expect(() => new Coord(90, -270)).toThrow("Invalid longitude");
});
