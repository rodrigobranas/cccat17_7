import ProcessPayment from "../../application/usecase/payment/ProcessPayment";
import HttpServer from "../http/HttpServer";

export default class PaymentController {

	constructor (readonly httpServer: HttpServer, readonly processPayment: ProcessPayment) {
		httpServer.register("post", "/process_payment", async (params: any, body: any) => {
			const response = await processPayment.execute(body);
			return response;
		});
	}
}
