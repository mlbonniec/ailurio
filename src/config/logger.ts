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
	},
	prettyPrint: {
		translateTime: 'SYS:dd-mm-yyyy HH:MM:ss o',
		colorize: true,
		hideObject: true,
		// @ts-ignore
		messageFormat: (log) => {
			const { res, req, msg } = log;
			const prettyMsg = msg.charAt(0).toUpperCase() + msg.slice(1);
			if (req)
				return `${req.method} ${req.url} - ${prettyMsg}`;
			else if (res)
				return `${res.statusCode} - ${prettyMsg}`;
			
			return prettyMsg;
		}
	}
}

export default options;
