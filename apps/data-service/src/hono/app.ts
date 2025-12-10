import { Hono } from 'hono';

export const App = new Hono<{ Bindings: Env }>();

App.get('/:id', (c) => {
	const id = c.req.param('id');
	return c.json({ id, message: 'Hello World!' });
});
