import amqp from "amqplib";
import crypto from "crypto";

(async () => {
	const connection = await amqp.connect("amqp://localhost");
	const channel = await connection.createChannel();
	channel.consume("rideCompleted.processPayment", function (msg: any) {
		console.log("processPayment", msg.content.toString());
		channel.ack(msg);
	});
	channel.consume("rideCompleted.sendReceipt", function (msg: any) {
		console.log("sendReceipt", msg.content.toString());
		channel.ack(msg);
	});
	channel.consume("rideCompleted.generateInvoice", function (msg: any) {
		console.log("generateInvoice", msg.content.toString());
		channel.ack(msg);
	});
})();
