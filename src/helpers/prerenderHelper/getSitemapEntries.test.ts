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
    vi.mock('@/helpers/contentHelper', () => ({
      getPostsByLangAndAuthors: (): {
        postsByLang: Record<string, { lang: string; slug: string; categories: string[]; authors: string[] }[]>;
        authors: { username: string; name: string }[];
      } => ({
        postsByLang: {
          fr: [{ lang: 'fr', slug: 'post-1', categories: ['category-1'], authors: ['author-1'] }],
          en: [{ lang: 'en', slug: 'post-2', categories: ['category-1'], authors: ['author-1'] }],
        },
        authors: [{ username: 'author-1', name: 'Author One' }],
      }),
    }));

    // Expected result
    const expectedSitemapEntries = [
      {
        priority: 1,
        links: [
          { lang: 'fr', url: '/' },
          { lang: 'fr', url: '/fr/' },
          { lang: 'en', url: '/en/' },
        ],
      },
      {
        links: [
          { lang: 'fr', url: '/fr/search/' },
          { lang: 'en', url: '/en/search/' },
        ],
      },
      {
        priority: 0.8,
        links: [
          { lang: 'fr', url: '/fr/categories/category-1/' },
          { lang: 'en', url: '/en/categories/category-1/' },
        ],
      },
      {
        priority: 0.7,
        links: [{ lang: 'fr', url: '/fr/post-1/' }],
      },
      {
        priority: 0.7,
        links: [{ lang: 'en', url: '/en/post-2/' }],
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
        links: [{ lang: 'fr', url: '/404' }],
      },
    ];

    const sitemapEntries = getSitemapEntries();

    expect(sitemapEntries).toEqual(expectedSitemapEntries);
  });
});
