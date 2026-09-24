import type { SearchPostData } from '@/types';

import { count, create, insertMultiple, search } from 'zbsearch';

import { LANGUAGES } from '@/constants';

export interface SearchIndex {
  search: (term: string, options?: { limit?: number }) => Promise<SearchPostData[]>;
}

const SEARCHABLE_PROPERTIES = ['title', 'categories', 'authorUsernames', 'authorNames', 'excerpt'] as const;

// zbsearch n'exige tous les mots de la recherche que s'ils figurent dans une même propriété : les
// propriétés recherchées sont donc réunies en un seul texte, pour que « symfony fpasquet » trouve
// les articles dont le titre contient l'un et les auteurs l'autre.
const getSearchableText = (post: SearchPostData): string =>
  SEARCHABLE_PROPERTIES.flatMap((property) => post[property] ?? []).join(' ');

export const createSearchIndex = (options: { lang: string; posts: SearchPostData[] }): SearchIndex => {
  const database = create({
    schema: {
      searchableText: 'string',
      timestamp: 'number',
    } as const,
    language: options.lang === LANGUAGES.FR ? 'french' : 'english',
  });

  insertMultiple(
    database,
    options.posts.map((post) => ({
      searchableText: getSearchableText(post),
      timestamp: new Date(post.date).getTime(),
      post,
    }))
  );

  return {
    search: async (term, { limit } = {}) => {
      const results = await search(database, {
        term,
        properties: ['searchableText'],
        // Tous les mots de la recherche doivent être trouvés, à une faute de frappe près.
        threshold: 0,
        tolerance: 1,
        sortBy: { property: 'timestamp', order: 'DESC' },
        limit: limit ?? count(database),
      });

      return results.hits.map((hit) => (hit.document as unknown as { post: SearchPostData }).post);
    },
  };
};
