import { fastify } from 'fastify';
import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { root } from './controllers/main';
import { getRandomQuote } from './routes/quotes';


export class ApiHandler {
  private readonly server: FastifyInstance;
  private readonly port: number;
  private readonly host: string;
  private readonly config: any;
  private readonly version?: number;

  constructor({
    httpServer = fastify,
    port = 8080,
    host = '127.0.0.1',
    config,
    version,
  }: {
    httpServer?: any;
    port?: number;
    host?: string;
    config: any;
    version?: number;
  }) {
    this.server = httpServer({
      trustProxy: true,
      logger: { level: 'debug' },
      exposeHeadRoutes: true,
      caseSensitive: false,
      ajv: {
        customOptions: {
          keywords: ['collectionFormat'],
        },
      },
    });
    this.host = host;
    this.port = port;
    this.config = config;
    this.version = version;
  }

  async setup() {
    this.server.register(cors, { origin: '*' });
  }

  async route() {
    this.server.register(root);
    this.server.get('/random-quote', getRandomQuote);
  }

  use() {
    return this.server;
  }

  serve() {
    this.server.listen({ host: this.host, port: this.port }, (err: any) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.info(`server listening on ${this.port} ...`);
    });
  }
}
