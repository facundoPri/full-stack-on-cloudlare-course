import { scheduleEvalWorkflow } from '@/helpers/route-ops';
import { addLinkClick } from '@repo/data-ops/queries/links';
import { LinkClickMessageType } from '@repo/data-ops/zod-schema/queue';

export async function handleLinkClickEvent(env: Env, event: LinkClickMessageType) {
	await addLinkClick(event.data);
	await scheduleEvalWorkflow(env, event);
}
