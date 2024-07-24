import axios from "axios";
import AccountGateway from "../../application/gateway/AccountGateway";
import HttpClient from "../http/HttpClient";

export default class AccountGatewayHttp implements AccountGateway {

	// Objetos do tipo T são: AxiosAdapter e FetchAdapter
	constructor (readonly httpClient: HttpClient) {
	}

	async signup(input: any): Promise<any> {
		const response = await this.httpClient.post("http://localhost:3001/signup", input);
		return response;
	}

	async getAccountById(accountId: string): Promise<any> {
		const response = await this.httpClient.get(`http://localhost:3001/accounts/${accountId}`);
		return response;
	}

}
