import fastify from 'fastify';
import AutoLoad from '@fastify/autoload';
import logger from '@config/logger';
import { join } from 'path';

const app = fastify({ logger });

// Routes
app.register(AutoLoad, {
  dir: join(__dirname, 'routes'),
  dirNameRoutePrefix: false
});

app.listen(Number(process.env.PORT));
