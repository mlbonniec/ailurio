import { getRepository } from '@controllers/index';
import type { FastifyInstance, FastifyServerOptions } from 'fastify';

export default async function (app: FastifyInstance, _opts: FastifyServerOptions): Promise<void> {
	app.get('/:owner/:repo', getRepository);
};
