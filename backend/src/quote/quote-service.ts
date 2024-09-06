import axios from 'axios';
import { load } from 'cheerio';

interface Quote {
  author: string;
  book: string;
  quote: string;
  publisher: string;
  date: string;
}

export async function getRandomQuotes() {
  const randomPageNumber = (Math.floor(Math.random() * 10) + 1).toString();
  const YES24 = 'https://www.yes24.com';

  const SOCIAL_POLITICS = `https://www.yes24.com/Product/Category/AttentionNewProduct?pageNumber=${randomPageNumber}&pageSize=5&categoryNumber=001001022`;
  const LITERATURE = `https://www.yes24.com/Product/Category/AttentionNewProduct?pageNumber=${randomPageNumber}&pageSize=5&categoryNumber=001001046`;
  const ESSAY = `https://www.yes24.com/Product/Category/AttentionNewProduct?pageNumber=${randomPageNumber}&pageSize=5&categoryNumber=001001047`;
  const HUMANITIES = `https://www.yes24.com/Product/Category/AttentionNewProduct?${randomPageNumber}=1&pageSize=5&categoryNumber=001001019`;
  const SCIENCE = `https://www.yes24.com/Product/Category/AttentionNewProduct?${randomPageNumber}=1&pageSize=5&categoryNumber=001001002`;
  const ART = `https://www.yes24.com/Product/Category/AttentionNewProduct?${randomPageNumber}=1&pageSize=5&categoryNumber=001001007`;

  try {
    const reqByCategories = [SOCIAL_POLITICS, SCIENCE, ART, LITERATURE, ESSAY, HUMANITIES].map((url) => {
      return axios.get(url);
    });

    const res = await Promise.all(reqByCategories);
    const $ = load(res.map((response) => response.data).join(''));

    const booksUrl: string[] = [];

    $('a.gd_name').each((_, element) => {
      if (element.attribs.href.startsWith('/Product')) {
        booksUrl.push(element.attribs.href);
      }
    });

    const reqByItems = Array.from(new Set(booksUrl)).map((bookLink) => {
      return axios.get(YES24 + bookLink);
    });
    const responses = await Promise.all(reqByItems);

    const quotesWithMeta: Quote[] = [];

    responses.map((response) => {
      const $ = load(response.data);
      if (!$) return;

      const bookMeta = $.extract({
        author: 'a.lnk_author',
        quote: 'div#infoset_inBook',
        title: 'h2.gd_name',
        publisher: 'span.gd_pub',
        date: 'span.gd_date',
      });
      if (!bookMeta || !bookMeta.quote || !bookMeta.title) return;

      const parsedQuote = bookMeta.quote
        .replace(/\s{2,}/g, '')
        .replace(/[\r\n]+/g, '')
        .replace('\t', '')
        .replace('책 속으로', '')
        ?.split('<br/>')[0];

      // TODO: more delicate validation
      quotesWithMeta.push({
        quote: typeof parsedQuote === 'string' ? parsedQuote : '',
        author: bookMeta.author ?? '',
        book: bookMeta.title,
        publisher: bookMeta.publisher ?? '',
        date: bookMeta.date ?? '',
      });
    });

    return quotesWithMeta;
  } catch (err) {
    console.error('Error fetching quotes:', err);
    return [];
  }
}
