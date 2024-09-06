import { FastifyInstance } from 'fastify';
import { S } from 'fluent-json-schema';
import { handleGetQuotes, handleModifyQuote } from './quote-controller.js';

export async function makeQuoteRoute(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/quotes',
    handler: handleGetQuotes,
    schema: {
      response: {
        200: S.object().prop(
          'data',
          S.array().items(
            S.object()
              .prop('quote', S.string())
              .prop('author', S.string())
              .prop('book', S.string())
              .prop('publisher', S.string())
              .prop('date', S.string()),
          ),
        ),
      },
    },
  });

  fastify.route({
    method: 'PUT',
    url: '/quotes',
    handler: handleModifyQuote,
    schema: {
      body: S.object().prop('paraQuote', S.string().required()).prop('userId', S.integer().required()),
      response: {
        200: S.object().prop(
          'data',
          S.array().items(
            S.object()
              .prop('quote', S.string())
              .prop('author', S.string())
              .prop('book', S.string())
              .prop('publisher', S.string())
              .prop('date', S.string())
              .prop('paraQuote', S.string().required())
              .prop('userId', S.integer().required()),
          ),
        ),
      },
      handler: handleModifyQuote,
    },
  });
}
