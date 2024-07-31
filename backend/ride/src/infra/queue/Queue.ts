import amqp from "amqplib";

export default interface Queue {
	connect (): Promise<void>;
	disconnect (): Promise<void>;
	setup (exchange: string, queue: string): Promise<void>;
	consume (queue: string, callback: Function): Promise<void>;
	publish (exchange: string, data: any): Promise<void>;
}

export class RabbitMQAdapter implements Queue {
	connection: any;

	constructor () {
	}

	async connect(): Promise<void> {
		this.connection = await amqp.connect("amqp://localhost");
		
	}

	async disconnect(): Promise<void> {
		this.connection.close();
	}

	async setup(exchange: string, queue: string): Promise<void> {
		const channel = await this.connection.createChannel();
		await channel.assertExchange(exchange, "direct", { durable: true });
		await channel.assertQueue(queue, { durable: true });
		await channel.bindQueue(queue, exchange, "");
	}

	async consume(queue: string, callback: Function): Promise<void> {
		const channel = await this.connection.createChannel();
		channel.consume(queue, async function (msg: any) {
			const input = JSON.parse(msg.content.toString());
			try {
				await callback(input);
				channel.ack(msg);
			} catch (e: any) {
				if (e.type === "no/go") {
					channel.ack(msg);
				} else {
					console.log("could not process message, keeping in the queue");
				}
			}
		})
	}

	async publish(exchange: string, data: any): Promise<void> {
		const channel = await this.connection.createChannel();
		await this.setup(exchange, exchange);
		channel.publish(exchange, "", Buffer.from(JSON.stringify(data)));
	}

}