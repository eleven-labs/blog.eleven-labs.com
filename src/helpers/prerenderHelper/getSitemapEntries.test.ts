import type * as ConstantsModule from '@/constants';

import { getSitemapEntries } from './getSitemapEntries';

describe('getSitemapEntries', () => {
  test('should generate sitemap entries correctly', () => {
    vi.mock('@/constants', async () => {
      const mod = await vi.importActual<typeof ConstantsModule>('@/constants');
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
        date: string;
        updatedAt?: string;
        categories: string[];
        authors: string[];
      }[] => [
        {
          lang: 'fr',
          slug: 'post-1',
          date: '2024-01-15T00:00:00.000Z',
          updatedAt: '2025-06-02T00:00:00.000Z',
          categories: ['architecture'],
          authors: ['author-1'],
        },
        { lang: 'en', slug: 'post-2', date: '2024-03-08T00:00:00.000Z', categories: ['php'], authors: ['author-1'] },
      ],
      getAuthors: (): { username: string }[] => [{ username: 'author-1' }],
    }));

    // Expected result
    const expectedSitemapEntries = [
      { priority: 1, lastmod: '2025-06-02', links: [{ lang: 'fr', url: '/fr/post-1/' }] },
      { priority: 1, lastmod: '2024-03-08', links: [{ lang: 'en', url: '/en/post-2/' }] },
      {
        priority: 0.8,
        changefreq: 'weekly',
        links: [
          { lang: 'fr', url: '/' },
          { lang: 'en', url: '/en/' },
        ],
      },
      {
        priority: 0.7,
        changefreq: 'weekly',
        links: [
          { lang: 'fr', url: '/fr/categories/all/' },
          { lang: 'en', url: '/en/categories/all/' },
        ],
      },
      { priority: 0.7, changefreq: 'weekly', links: [{ lang: 'en', url: '/en/categories/php/' }] },
      { priority: 0.7, changefreq: 'weekly', links: [{ lang: 'fr', url: '/fr/categories/architecture/' }] },
      {
        priority: 0.5,
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
