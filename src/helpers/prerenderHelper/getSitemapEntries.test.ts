import { getSitemapEntries, SitemapEntry } from './getSitemapEntries';

describe('getSitemapEntries', () => {
  test('should generate sitemap entries correctly', () => {
    vi.mock('@/constants', async () => {
      const mod = await vi.importActual<typeof import('@/constants')>('@/constants');
      return {
        ...mod,
        IS_DEBUG: false,
        LANGUAGES_AVAILABLE_WITH_DT: mod.LANGUAGES_AVAILABLE,
      };
    });
    vi.mock('@/helpers/markdownContentManagerHelper', () => ({
      getPosts: (): {
        lang: string;
        slug: string;
        categories: string[];
        authors: string[];
        date: string;
        cover?: { path: string };
      }[] => [
        {
          lang: 'fr',
          slug: 'post-1',
          categories: ['architecture'],
          authors: ['author-1'],
          date: '2024-01-01T00:00:00',
          cover: { path: '/imgs/post-1/cover.png' },
        },
        { lang: 'en', slug: 'post-2', categories: ['php'], authors: ['author-1'], date: '2024-01-01T00:00:00' },
      ],
      getAuthors: (): { username: string }[] => [{ username: 'author-1' }],
    }));

    // Expected result
    const expectedSitemapEntries: SitemapEntry[] = [
      {
        links: [{ lang: 'fr', url: '/fr/post-1/' }],
        lastModified: '2024-01-01T00:00:00',
        image: { url: '/imgs/post-1/cover-w400-h245-x2.avif' },
      },
      { links: [{ lang: 'en', url: '/en/post-2/' }], lastModified: '2024-01-01T00:00:00' },
      {
        changeFrequency: 'weekly',
        links: [
          { lang: 'fr', url: '/' },
          { lang: 'fr', url: '/fr/' },
          { lang: 'en', url: '/en/' },
        ],
      },
      {
        changeFrequency: 'weekly',
        links: [
          { lang: 'fr', url: '/fr/categories/all/' },
          { lang: 'en', url: '/en/categories/all/' },
        ],
      },
      { changeFrequency: 'weekly', links: [{ lang: 'en', url: '/en/categories/php/' }] },
      { changeFrequency: 'weekly', links: [{ lang: 'fr', url: '/fr/categories/architecture/' }] },
      {
        links: [
          { lang: 'fr', url: '/fr/authors/author-1/' },
          { lang: 'en', url: '/en/authors/author-1/' },
        ],
      },
    ];

    const sitemapEntries = getSitemapEntries();

    expect(sitemapEntries).toEqual(expectedSitemapEntries);
  });
});
