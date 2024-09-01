import axios from 'axios';
import { load } from 'cheerio';
import { S } from 'fluent-json-schema';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default async function quote(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/quotes',
    handler: getRandomQuotes,
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

  async function getRandomQuotes(_req: FastifyRequest, reply: FastifyReply) {
    try {
      const YES24 = 'https://www.yes24.com';
      const SOCIAL_POLITICS =
        'https://www.yes24.com/Product/Category/AttentionNewProduct?pageNumber=1&pageSize=5&categoryNumber=001001022';
      const LITERATURE =
        'https://www.yes24.com/Product/Category/AttentionNewProduct?pageNumber=1&pageSize=5&categoryNumber=001001046';
      const ESSAY =
        'https://www.yes24.com/Product/Category/AttentionNewProduct?pageNumber=1&pageSize=5&categoryNumber=001001047';
      const HUMANITIES =
        'https://www.yes24.com/Product/Category/AttentionNewProduct?pageNumber=1&pageSize=5&categoryNumber=001001019';
      const SCIENCE =
        'https://www.yes24.com/Product/Category/AttentionNewProduct?pageNumber=1&pageSize=5&categoryNumber=001001002';
      const ART =
        'https://www.yes24.com/Product/Category/AttentionNewProduct?pageNumber=1&pageSize=5&categoryNumber=001001007';

      const reqByCategories = [SOCIAL_POLITICS, SCIENCE, ART, LITERATURE, ESSAY, HUMANITIES].map((url) => {
        return axios.get(url);
      });
      const res = await Promise.all(reqByCategories);

      const $ = load(res.map((response) => response.data).join(''));

      const booksUrl: string[] = [];

      $('a.gd_name').each((_, element) => {
        booksUrl.push(element.attribs.href);
      });

      const reqByItems = Array.from(new Set(booksUrl)).map((hyperlink) => {
        return axios.get(YES24 + hyperlink);
      });
      const responses = await Promise.all(reqByItems);

      const quotes = responses.map((response) => {
        const $ = load(response.data);
        if (!$) return;

        const bookMeta = $.extract({
          author: 'a.lnk_author',
          quote: 'div#infoset_inBook',
          title: 'h2.gd_name',
          publisher: 'span.gd_pub',
          date: 'span.gd_date',
        });
        const quote = bookMeta.quote
          ?.replace(/\s{2,}/g, '')
          .replace(/[\r\n]+/g, '')
          .replace('\t', '')
          .replace('책 속으로', '')
          .split('<br/>')[0];

        return {
          quote,
          author: bookMeta.author,
          book: bookMeta.title,
          publisher: bookMeta.publisher,
          date: bookMeta.date,
        };
      });
      return reply.send({ data: quotes });
    } catch (error) {
      console.error('Error fetching quotes:', error);
      return [];
    }
  }
}
