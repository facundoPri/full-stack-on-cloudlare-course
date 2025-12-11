import { WorkerEntrypoint } from 'cloudflare:workers';
import { App } from './hono/app';
import { initDatabase } from '@repo/data-ops/database';
import { QueueMessageSchema } from '@repo/data-ops/zod-schema/queue';
import { handleLinkClickEvent } from './queue-handlers/link-clicks';

export default class DataService extends WorkerEntrypoint<Env> {
	constructor(ctx: ExecutionContext, env: Env) {
		super(ctx, env);
		initDatabase(env.DB);
	}

	fetch(request: Request) {
		return App.fetch(request, this.env, this.ctx);
	}

	async queue(batch: MessageBatch<unknown>) {
		for (const message of batch.messages) {
			const parseEvent = QueueMessageSchema.safeParse(message.body);
			if (!parseEvent.success) {
				console.error("Invalid queue message", parseEvent.error);
				return
			}

			const event = parseEvent.data;
			if (event.type === "LINK_CLICK") {
				await handleLinkClickEvent(this.env, event);
			}
		}
	}
}
