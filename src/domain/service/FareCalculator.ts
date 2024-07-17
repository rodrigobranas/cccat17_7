export default interface FareCalculator {
	calculate (distance: number): number;
}

export class FareCalculatorFactory {
	static create (date: Date): FareCalculator {
		if (date.getDay() === 0) return new SundayFare(); 
		if (date.getHours() > 18 || date.getHours() < 8) return new OvernightFare();
		if (date.getHours() >= 8 && date.getHours() <= 18) return new NormalFare();
		throw new Error();
	}
}

export class SundayFare implements FareCalculator {
	calculate(distance: number): number {
		return distance * 5;
	}
}

export class OvernightFare implements FareCalculator {
	calculate(distance: number): number {
		return distance * 3.9; 
	}
}

export class NormalFare implements FareCalculator {
	calculate(distance: number): number {
		return distance * 2.1; 
	}
}
