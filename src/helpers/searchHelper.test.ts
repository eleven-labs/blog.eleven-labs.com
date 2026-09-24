import type { SearchPostData } from '@/types';

import { createSearchIndex } from './searchHelper';

const createPost = (post: Partial<SearchPostData> & Pick<SearchPostData, 'slug' | 'date'>): SearchPostData => ({
  contentType: 'article',
  lang: 'fr',
  readingTime: 5,
  title: post.slug,
  excerpt: '',
  categories: [],
  authorUsernames: [],
  authorNames: [],
  ...post,
});

const posts: SearchPostData[] = [
  createPost({
    slug: 'symfony-clean-architecture',
    date: '2025-10-14T00:00:00.000Z',
    title: 'La Clean Architecture appliquée à un projet Symfony',
    categories: ['php', 'architecture'],
    authorUsernames: ['fpasquet'],
    authorNames: ['Fabien Pasquet'],
  }),
  createPost({
    slug: 'symfony-live',
    date: '2025-04-09T00:00:00.000Z',
    title: 'Symfony Live 2025',
    categories: ['php'],
    authorUsernames: ['jdoe'],
    authorNames: ['John Doe'],
  }),
  createPost({
    slug: 'react-hooks',
    date: '2024-01-17T00:00:00.000Z',
    title: 'Les hooks de React',
    excerpt: 'Découvrez les hooks',
    categories: ['javascript'],
    authorUsernames: ['fpasquet'],
    authorNames: ['Fabien Pasquet'],
  }),
];

describe('createSearchIndex', () => {
  const searchIndex = createSearchIndex({ lang: 'fr', posts });
  const searchSlugs = async (term: string, options?: { limit?: number }): Promise<string[]> =>
    (await searchIndex.search(term, options)).map((post) => post.slug);

  it('should return every post sorted by date when the search is empty', async () => {
    expect(await searchSlugs('')).toEqual(['symfony-clean-architecture', 'symfony-live', 'react-hooks']);
  });

  it('should search in the title, the categories, the authors and the excerpt', async () => {
    expect(await searchSlugs('symfony')).toEqual(['symfony-clean-architecture', 'symfony-live']);
    expect(await searchSlugs('javascript')).toEqual(['react-hooks']);
    expect(await searchSlugs('fpasquet')).toEqual(['symfony-clean-architecture', 'react-hooks']);
    expect(await searchSlugs('John')).toEqual(['symfony-live']);
    expect(await searchSlugs('découvrez')).toEqual(['react-hooks']);
  });

  it('should match the beginning of a word and tolerate a typo', async () => {
    expect(await searchSlugs('symf')).toEqual(['symfony-clean-architecture', 'symfony-live']);
    expect(await searchSlugs('symfny')).toEqual(['symfony-clean-architecture', 'symfony-live']);
  });

  it('should only return the posts that contain every word, whatever their property', async () => {
    expect(await searchSlugs('symfony fpasquet')).toEqual(['symfony-clean-architecture']);
    expect(await searchSlugs('symfony unknown')).toEqual([]);
  });

  it('should limit the number of posts', async () => {
    expect(await searchSlugs('symfony', { limit: 1 })).toEqual(['symfony-clean-architecture']);
  });
});
