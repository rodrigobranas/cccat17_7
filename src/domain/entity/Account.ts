import crypto from "crypto";
import Cpf from "../vo/Cpf";
import Email from "../vo/Email";
import Name from "../vo/Name";
import CarPlate from "../vo/CarPlate";

// Entity, forma um Aggregate liderado por Account (root) que contém Name, Email, Cpf e CarPlate
export default class Account {
	private cpf: Cpf;
	private name: Name;
	private email: Email;
	private carPlate: CarPlate;

	constructor (readonly accountId: string, name: string, email: string, cpf: string, carPlate: string, readonly isPassenger: boolean, readonly isDriver: boolean) {
		this.name = new Name(name);
		this.email = new Email(email);
		this.cpf = new Cpf(cpf);
		this.carPlate = new CarPlate(carPlate)
	}

	static create (name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean) {
		const accountId = crypto.randomUUID();
		return new Account(accountId, name, email, cpf, carPlate, isPassenger, isDriver);
	}

	getCpf () {
		return this.cpf.getValue();
	}

	getEmail () {
		return this.email.getValue();
	}

	setEmail (email: string) {
		this.email = new Email(email);
	}

	getName () {
		return this.name.getValue();
	}

	getCarPlate () {
		return this.carPlate.getValue();
	}
}