import { getSitemapEntries } from './getSitemapEntries';

describe('getSitemapEntries', () => {
  test('should generate sitemap entries correctly', () => {
    vi.mock('@/constants', async () => {
      const mod = await vi.importActual<typeof import('@/constants')>('@/constants');
      return {
        ...mod,
        CategoryEnum: ['category-1'],
      };
    });
    vi.mock('@/helpers/markdownContentManagerHelper', () => ({
      getPosts: (): { lang: string; slug: string; categories: string[]; authors: string[] }[] => [
        { lang: 'fr', slug: 'post-1', categories: ['architecture'], authors: ['author-1'] },
        { lang: 'en', slug: 'post-2', categories: ['php'], authors: ['author-1'] },
      ],
      getAuthors: (): { username: string; name: string }[] => [{ username: 'author-1', name: 'Author One' }],
    }));

    // Expected result
    const expectedSitemapEntries = [
      { priority: 1, links: [{ lang: 'fr', url: '/fr/post-1/' }] },
      { priority: 1, links: [{ lang: 'en', url: '/en/post-2/' }] },
      {
        priority: 0.8,
        links: [
          { lang: 'fr', url: '/' },
          { lang: 'fr', url: '/fr/' },
          { lang: 'en', url: '/en/' },
        ],
      },
      {
        priority: 0.7,
        links: [
          { lang: 'fr', url: '/fr/categories/php/' },
          { lang: 'en', url: '/en/categories/php/' },
        ],
      },
      {
        priority: 0.7,
        links: [
          { lang: 'fr', url: '/fr/categories/architecture/' },
          { lang: 'en', url: '/en/categories/architecture/' },
        ],
      },
      {
        priority: 0.5,
        links: [
          { lang: 'fr', url: '/fr/authors/author-1/' },
          { lang: 'en', url: '/en/authors/author-1/' },
        ],
      },
      {
        priority: 0,
        links: [
          { lang: 'fr', url: '/fr/search/' },
          { lang: 'en', url: '/en/search/' },
        ],
      },
      { priority: 0, links: [{ lang: 'fr', url: '/404' }] },
    ];

    const sitemapEntries = getSitemapEntries();

    expect(sitemapEntries).toEqual(expectedSitemapEntries);
  });
});