import type { SearchPostData } from '@/types';

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

// Un article dont chaque mot de la recherche figure dans ses mots-clés, ses catégories ou ses
// auteurs, ou commence par une majuscule comme le nom d'une technologie (« Go », « IA »), voit son
// score doublé : il passe devant ceux qui ne contiennent qu'un homonyme (« go » dans « should you go
// hybrid? »).
const NAME_MATCH_BOOST = 2;

// Un mot aussi court ne fait qu'ouvrir une liste de mots bien trop longue (« ia » : « IAM »,
// « iaas »… ; « go » : « google », « goal »…) : les articles qui le contiennent en entier passent
// devant ceux qui n'en contiennent que le début. Plus long, il reste recherché comme le début d'un
// mot, pour trouver « React » pendant qu'on tape « rea ».
const SHORT_WORD_MAX_LENGTH = 2;

// Seule la marque du pluriel est retirée, pour que « tests » trouve « test ». Une racinisation
// complète abîme les mots en cours de saisie : elle réduit « rea » à « re », qui ne trouve plus
// seulement « React » mais presque tous les articles.
const removePlural = (word: string): string => (/^.{2,}[^s][sx]$/.test(word) ? word.slice(0, -1) : word);

const WORD_PATTERN = /[\p{L}\p{N}]+/gu;

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
        stemming: true,
        stemmer: removePlural,
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

  const normalizeWord = (word: string): string | undefined => database.tokenizer.tokenize(word)[0];

  // Mots de chaque article, une fois normalisés comme ceux de la recherche (sans accent, au
  // singulier…), dont ceux qui peuvent être le nom d'une technologie, d'un concept ou d'un auteur.
  const wordsByPost = new Map(
    options.posts.map((post) => {
      const words = new Set<string>();
      const names = new Set<string>();
      const addWords = (texts: string[], isName: (word: string) => boolean): void => {
        for (const text of texts) {
          for (const [word] of text.matchAll(WORD_PATTERN)) {
            const normalizedWord = normalizeWord(word);
            if (normalizedWord) {
              words.add(normalizedWord);
              if (isName(word)) {
                names.add(normalizedWord);
              }
            }
          }
        }
      };

      addWords([...post.keywords, ...(post.categories ?? []), ...post.authorUsernames, ...post.authorNames], () => true);
      addWords([post.title, post.excerpt, ...post.headings], (word) => word[0] !== word[0].toLowerCase());

      return [post, { words, names }];
    })
  );

  const isNameMatch = (post: SearchPostData, searchWords: string[]): boolean =>
    searchWords.every((searchWord) => wordsByPost.get(post)!.names.has(searchWord));

  const hasShortWords = (post: SearchPostData, searchWords: string[]): boolean =>
    searchWords
      .filter((searchWord) => searchWord.length <= SHORT_WORD_MAX_LENGTH)
      .every((searchWord) => wordsByPost.get(post)!.words.has(searchWord));

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
      const searchWords = database.tokenizer.tokenize(term);

      return getPosts(
        scoredHits
          .filter((hit) => matchingIds.has(hit.id))
          .map((hit) => ({
            ...hit,
            hasShortWords: hasShortWords(getDocument(hit).post, searchWords),
            score:
              hit.score *
              getRecencyFactor(getDocument(hit).timestamp, now) *
              (isNameMatch(getDocument(hit).post, searchWords) ? NAME_MATCH_BOOST : 1),
          }))
          .sort((a, b) => Number(b.hasShortWords) - Number(a.hasShortWords) || b.score - a.score)
      );
    }

    return [];
  };

  return {
    search: async (term, { limit } = {}) => (await searchPosts(term)).slice(0, limit),
  };
};
