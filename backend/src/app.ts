import AutoLoad from '@fastify/autoload';
import Sensible from '@fastify/sensible';
import Env from '@fastify/env';
import Cors from '@fastify/cors';
import UnderPressure from '@fastify/under-pressure';
import { S } from 'fluent-json-schema';
import { join } from 'desm';
import { FastifyInstance, FastifyRegisterOptions } from 'fastify';

export async function init(fastify: FastifyInstance, opts?: FastifyRegisterOptions<unknown>) {
  await fastify.register(Env, {
    schema: S.object().prop('NODE_ENV', S.string().required()).valueOf(),
  });

  await fastify.register(Sensible);

  await fastify.register(UnderPressure, {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: 1000000000,
    maxRssBytes: 1000000000,
    maxEventLoopUtilization: 0.98,
  });

  await fastify.register(Cors, {
    origin: true,
  });

  await fastify.register(AutoLoad, {
    dir: join(import.meta.url, 'plugins'),
    options: Object.assign({}, opts),
  });

  await fastify.register(AutoLoad, {
    dir: join(import.meta.url, 'routes'),
    dirNameRoutePrefix: false,
    options: Object.assign({}, opts),
  });
}
