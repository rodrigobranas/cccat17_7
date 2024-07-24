export default interface MailerGateway {
	send (recipient: string, subject: string, message: string): Promise<void>;
}
