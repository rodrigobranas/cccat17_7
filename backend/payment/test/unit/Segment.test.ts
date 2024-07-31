import Coord from "../../src/domain/vo/Coord";
import DistanceCalculator from "../../src/domain/service/DistanceCalculator";
import Segment from "../../src/domain/vo/Segment";

test("Deve calcular a distância de um segmento", function () {
	const from = new Coord(-27.584905257808835, -48.545022195325124);
	const to = new Coord(-27.496887588317275, -48.522234807851476);
	const segment = new Segment(from, to);
	expect(segment.getDistance()).toBe(10);
});
