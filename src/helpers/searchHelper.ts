import type { SearchPostData } from '@/types';

import { stemmer as englishStemmer } from '@zbsearch/stemmers/english';
import { stemmer as frenchStemmer } from '@zbsearch/stemmers/french';
import { stopwords as englishStopwords } from '@zbsearch/stopwords/english';
import { stopwords as frenchStopwords } from '@zbsearch/stopwords/french';
import { create, insertMultiple, search } from 'zbsearch';

import { LANGUAGES } from '@/constants';

export interface SearchIndex {
  search: (term: string, options?: { limit?: number }) => Promise<SearchPostData[]>;
}

interface SearchDocument {
  post: SearchPostData;
  timestamp: number;
}

// Poids de chaque propriété dans le score : un mot trouvé dans le titre compte quatre fois plus
// qu'un mot trouvé dans le résumé.
const BOOST = {
  title: 4,
  keywords: 3,
  authors: 3,
  categories: 2,
  headings: 1.5,
  excerpt: 1,
} as const;

const PROPERTIES = Object.keys(BOOST) as (keyof typeof BOOST)[];

// Le score d'un article est divisé par deux quand il a dix ans : à pertinence proche, le plus
// récent passe devant, sans qu'un article récent qui ne fait que citer le terme ne dépasse ceux
// qui en traitent.
const RECENCY_HALF_LIFE_IN_YEARS = 10;
const YEAR_IN_MILLISECONDS = 365 * 24 * 60 * 60 * 1000;

const getRecencyFactor = (timestamp: number, now: number): number =>
  1 / (1 + Math.max(0, now - timestamp) / YEAR_IN_MILLISECONDS / RECENCY_HALF_LIFE_IN_YEARS);

export const createSearchIndex = (options: { lang: string; posts: SearchPostData[] }): SearchIndex => {
  const isFrench = options.lang === LANGUAGES.FR;
  const database = create({
    schema: {
      title: 'string',
      keywords: 'string[]',
      authors: 'string',
      categories: 'string[]',
      headings: 'string[]',
      excerpt: 'string',
      searchableText: 'string',
      timestamp: 'number',
    } as const,
    components: {
      tokenizer: {
        language: isFrench ? 'french' : 'english',
        // « tests » trouve « test », « architectures » trouve « architecture »…
        stemming: true,
        stemmer: isFrench ? frenchStemmer : englishStemmer,
        // Sans quoi « les tests en php » exigerait les mots « les » et « en ».
        stopWords: isFrench ? frenchStopwords : englishStopwords,
      },
    },
  });

  insertMultiple(
    database,
    options.posts.map((post) => {
      const properties = {
        title: post.title,
        keywords: post.keywords,
        authors: [...post.authorUsernames, ...post.authorNames].join(' '),
        categories: post.categories ?? [],
        headings: post.headings,
        excerpt: post.excerpt,
      };
      return {
        ...properties,
        // zbsearch n'exige tous les mots de la recherche que s'ils figurent dans une même
        // propriété : elles sont donc aussi réunies en un seul texte, pour que « symfony fpasquet »
        // trouve les articles dont le titre contient l'un et les auteurs l'autre.
        searchableText: Object.values(properties).flat().join(' '),
        timestamp: new Date(post.date).getTime(),
        post,
      };
    })
  );

  // Les documents gardent l'article tel qu'il a été inséré, hors du schéma indexé.
  const getDocument = (hit: { document: unknown }): SearchDocument => hit.document as SearchDocument;
  const getPosts = (hits: { document: unknown }[]): SearchPostData[] => hits.map((hit) => getDocument(hit).post);

  const searchPosts = async (term: string): Promise<SearchPostData[]> => {
    if (!term.trim()) {
      const { hits } = await search(database, {
        term: '',
        sortBy: { property: 'timestamp', order: 'DESC' },
        limit: options.posts.length,
      });
      return getPosts(hits);
    }

    // Une faute de frappe n'est tolérée que si la recherche exacte ne trouve rien : sinon « vue »
    // trouverait aussi « vie » et « rue ».
    for (const tolerance of [0, 1]) {
      const { hits: matchingHits } = await search(database, {
        term,
        properties: ['searchableText'],
        threshold: 0,
        tolerance,
        limit: options.posts.length,
      });
      if (matchingHits.length === 0) {
        continue;
      }

      const matchingIds = new Set(matchingHits.map((hit) => hit.id));
      const { hits: scoredHits } = await search(database, {
        term,
        properties: PROPERTIES,
        boost: BOOST,
        threshold: 1,
        tolerance,
        limit: options.posts.length,
      });
      const now = Date.now();

      return getPosts(
        scoredHits
          .filter((hit) => matchingIds.has(hit.id))
          .map((hit) => ({
            ...hit,
            score: hit.score * getRecencyFactor(getDocument(hit).timestamp, now),
          }))
          .sort((a, b) => b.score - a.score)
      );
    }

    return [];
  };

  return {
    search: async (term, { limit } = {}) => (await searchPosts(term)).slice(0, limit),
  };
};
