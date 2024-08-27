import { fastify } from 'fastify';
import mongoose from 'mongoose';
import { ApiHandler } from './server';

const app = new ApiHandler({
  httpServer: fastify,
  port: 8080,
  config: {},
});

const start = async () => {
  await app.setup();
  await app.route();
  app.serve();
}

start().catch(console.error);


