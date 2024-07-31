import axios from "axios";
import AccountGateway from "../../application/gateway/AccountGateway";
import HttpClient from "../http/HttpClient";
import PaymentGateway from "../../application/gateway/PaymentGateway";

export default class PaymentGatewayHttp implements PaymentGateway {

	// Objetos do tipo T são: AxiosAdapter e FetchAdapter
	constructor (readonly httpClient: HttpClient) {
	}
	async processPayment(input: any): Promise<any> {
		const response = await this.httpClient.post("http://localhost:3002/process_payment", input);
		return response;
	}

}
