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
  keywords: [],
  headings: [],
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
    slug: 'conference-recap',
    date: '2024-06-01T00:00:00.000Z',
    title: 'Retour sur une conférence',
    excerpt: 'Un talk évoquait Docker en passant',
    headings: ['Les tests de mutation'],
  }),
  createPost({
    slug: 'docker-cheat-sheet',
    date: '2020-04-01T00:00:00.000Z',
    title: 'Cheat Sheet : Docker, tout ce que vous devez savoir',
    keywords: ['conteneur'],
  }),
  createPost({
    slug: 'react-hooks',
    date: '2019-01-17T00:00:00.000Z',
    title: 'Les hooks de React',
    excerpt: 'Un guide complet',
    categories: ['javascript'],
    authorUsernames: ['fpasquet'],
    authorNames: ['Fabien Pasquet'],
  }),
  createPost({
    slug: 'symfony-2012',
    date: '2012-01-01T00:00:00.000Z',
    title: 'Découvrir Symfony',
  }),
  createPost({
    slug: 'symfony-2024',
    date: '2024-01-01T00:00:00.000Z',
    title: 'Découvrir Symfony',
  }),
];

describe('createSearchIndex', () => {
  const searchIndex = createSearchIndex({ lang: 'fr', posts });
  const searchSlugs = async (term: string, options?: { limit?: number }): Promise<string[]> =>
    (await searchIndex.search(term, options)).map((post) => post.slug);

  it('should return every post sorted by date when the search is empty', async () => {
    expect(await searchSlugs('')).toEqual([
      'symfony-clean-architecture',
      'conference-recap',
      'symfony-2024',
      'docker-cheat-sheet',
      'react-hooks',
      'symfony-2012',
    ]);
  });

  it('should search in the title, the keywords, the authors, the categories, the headings and the excerpt', async () => {
    expect(await searchSlugs('clean')).toEqual(['symfony-clean-architecture']);
    expect(await searchSlugs('conteneur')).toEqual(['docker-cheat-sheet']);
    expect(await searchSlugs('pasquet')).toEqual(['symfony-clean-architecture', 'react-hooks']);
    expect(await searchSlugs('javascript')).toEqual(['react-hooks']);
    expect(await searchSlugs('mutation')).toEqual(['conference-recap']);
    expect(await searchSlugs('guide')).toEqual(['react-hooks']);
  });

  it('should rank the posts whose title matches before the ones which only mention the term', async () => {
    expect(await searchSlugs('docker')).toEqual(['docker-cheat-sheet', 'conference-recap']);
  });

  it('should rank the most recent post first when the posts are as relevant', async () => {
    expect((await searchSlugs('découvrir symfony')).slice(0, 2)).toEqual(['symfony-2024', 'symfony-2012']);
  });

  it('should ignore the accents, the stop words and the plural', async () => {
    expect(await searchSlugs('conference')).toEqual(['conference-recap']);
    expect(await searchSlugs('les tests de la mutation')).toEqual(['conference-recap']);
    expect(await searchSlugs('conteneurs')).toEqual(['docker-cheat-sheet']);
  });

  it('should match the beginning of a word', async () => {
    expect(await searchSlugs('symf')).toHaveLength(3);
  });

  it('should tolerate a typo only when the search finds nothing', async () => {
    expect(await searchSlugs('symfny')).toHaveLength(3);
    expect(await searchSlugs('hook')).toEqual(['react-hooks']);
  });

  it('should only return the posts that contain every word, whatever their property', async () => {
    expect(await searchSlugs('symfony fpasquet')).toEqual(['symfony-clean-architecture']);
    expect(await searchSlugs('symfony unknown')).toEqual([]);
  });

  it('should limit the number of posts', async () => {
    expect(await searchSlugs('symfony', { limit: 2 })).toHaveLength(2);
  });
});

describe('createSearchIndex with ambiguous words', () => {
  const searchIndex = createSearchIndex({
    lang: 'fr',
    posts: [
      createPost({ slug: 'go-api', date: '2017-01-01T00:00:00.000Z', title: 'Construire une api en Go' }),
      createPost({ slug: 'go-hybrid', date: '2022-01-01T00:00:00.000Z', title: 'Should you go hybrid?' }),
      createPost({ slug: 'iam', date: '2025-01-01T00:00:00.000Z', title: 'IAM aws' }),
      createPost({
        slug: 'ia',
        date: '2012-01-01T00:00:00.000Z',
        title: 'Retour sur une longue journée de conférences',
        excerpt: 'Des talks sur le design et la ia générative',
      }),
      createPost({ slug: 'react', date: '2019-01-01T00:00:00.000Z', title: 'Une application React' }),
      createPost({ slug: 're-usage', date: '2025-01-01T00:00:00.000Z', title: 'Le ré-usage du code' }),
    ],
  });
  const searchSlugs = async (term: string): Promise<string[]> =>
    (await searchIndex.search(term)).map((post) => post.slug);

  it('should rank the posts which name the term before the ones which contain a homonym', async () => {
    expect(await searchSlugs('go')).toEqual(['go-api', 'go-hybrid']);
  });

  it('should rank the posts which contain a short word before the ones which only start with it', async () => {
    expect(await searchSlugs('ia')).toEqual(['ia', 'iam']);
  });

  it('should not shorten a word being typed', async () => {
    expect(await searchSlugs('rea')).toEqual(['react']);
  });
});
