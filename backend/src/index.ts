import { fastify } from 'fastify';
import { init } from './app.js';

export async function serve() {
  const server = fastify({ logger: true });
  await init(server, {});

  server.get('/', async (_req, _res) => {
    return 'Para-quote server is running';
  });

  server.listen({ host: '127.0.0.1', port: 8080 }, (err) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
  });
}

serve();
