import { FastifyReply, FastifyRequest } from 'fastify';
import { getRandomQuotes } from './quote-service.js';

export async function handleGetQuotes(_req: FastifyRequest, _res: FastifyReply) {
  const quotes = await getRandomQuotes();
  return { data: quotes };
}

export async function handleModifyQuote(req: FastifyRequest, res: FastifyReply) {
  // TODO: Implement this
}
