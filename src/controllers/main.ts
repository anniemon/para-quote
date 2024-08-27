import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

export const root: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.get('/', async (req, res) => {
    res.code(200).send(`This is para-quote api server`);
  });
};

export default fp(root);
