export default class MailerGateway {

	async send (recipient: string, subject: string, message: string) {
		console.log(recipient, subject, message);
	}
}
