import fp from 'fastify-plugin';
import { makeQuoteRoute } from './quote-route.js';

export default fp(makeQuoteRoute, {
  name: 'quoteRoute',
});
