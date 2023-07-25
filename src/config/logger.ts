import { FastifyLoggerOptions } from 'fastify';

const options: FastifyLoggerOptions = {
	serializers: {
		req: (req) => {
			return {
				method: req.method,
				url: req.url,
				remoteAddress: req.socket.remoteAddress,
			}
		},
	}
}

export default options;
