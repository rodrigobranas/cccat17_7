import MailerGateway from "../../application/gateway/MailerGateway";

export default class MailerGatewayFake implements MailerGateway {

	async send (recipient: string, subject: string, message: string) {
		console.log(recipient, subject, message);
	}
}
