import { S } from 'fluent-json-schema';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default async function ping(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/ping',
    handler: ping,
    schema: {
      response: {
        200: S.object().prop('data', S.string()),
      },
    },
  });

  async function ping(_req: FastifyRequest, reply: FastifyReply) {
    reply.send({ data: 'pong' });
  }
}
