import axios from "axios";
import fetch from "node-fetch";

// Se S é subclasse de T então objetos do tipo T podem ser substituídos por objetos do tipo S sem quebrar o funcionamento do programa

// T
export default interface HttpClient {
	get (url: string): Promise<any>;
	post (url: string, body: any): Promise<any>;
}

// S
export class AxiosAdapter implements HttpClient {

	async get(url: string): Promise<any> {
		// preconditions cannot be strenghtened in subclass
		// if (url.includes("localhost")) throw new Error("Production only");
		const response = await axios.get(url);
		// postconditions cannot be weakened in the subtype
		// invariants must be preserved in the subtype
		// if ((new Date()).getDay() === 2) {
		// 	return {};
		// }
		return response.data;
	}

	async post(url: string, body: any): Promise<any> {
		const response = await axios.post(url, body);
		return response.data;
	}

}

// S
export class FetchAdapter implements HttpClient {

	async get(url: string): Promise<any> {
		const response = await fetch(url);
		return response.json();
	}

	async post(url: string, body: any): Promise<any> {
		const response = await fetch(url, {
			method: "post",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify(body)
		});
		return response.json();
	}

}
