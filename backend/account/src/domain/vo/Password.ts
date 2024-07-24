import crypto from "crypto";

// Value Object
export default interface Password {
	value: string;
	verify (password: string): boolean;
}

export class PasswordPlain implements Password {
	value: string;

	constructor (password: string) {
		this.value = password;
	}

	verify(password: string): boolean {
		return this.value === password;
	}
}

export class PasswordMd5 implements Password {
	value: string;

	constructor (password: string) {
		this.value = crypto.createHash("md5").update(password).digest("hex");

	}

	verify(password: string): boolean {
		return this.value === crypto.createHash("md5").update(password).digest("hex");
	}
}

export class PasswordSha1 implements Password {
	value: string;

	constructor (password: string) {
		this.value = crypto.createHash("sha1").update(password).digest("hex");
	}

	verify(password: string): boolean {
		return this.value === crypto.createHash("sha1").update(password).digest("hex");
	}
}

export class PasswordSha256 implements Password {
	value: string;

	constructor (password: string) {
		this.value = crypto.createHash("sha256").update(password).digest("hex");
	}

	verify(password: string): boolean {
		return this.value === crypto.createHash("sha256").update(password).digest("hex");
	}
}

export class PasswordFactory {
	static create (password: string, type: string): Password {
		if (type === "plain") return new PasswordPlain(password);
		if (type === "md5") return new PasswordMd5(password);
		if (type === "sha1") return new PasswordSha1(password);
		if (type === "sha256") return new PasswordSha256(password);
		throw new Error("");
	}
}