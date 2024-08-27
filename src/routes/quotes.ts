import { FastifyRequest, FastifyReply } from 'fastify';
import { Quote } from '../models/quote';

export const getRandomQuote = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const quote = {text: 'This is a dummy random quote', author: 'anniemon'};
    if (quote) {
      reply.send({ quote: quote.text, author: quote.author });
    } else {
      reply.send({ message: 'No quotes found' });
    }
  } catch (err) {
    request.log.error(err);
    reply.status(500).send({ message: 'Error fetching quote' });
  }
};
