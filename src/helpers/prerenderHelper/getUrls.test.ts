import { ContentTypeEnum, LanguageEnum } from '@/constants';

import {
  getAuthorPageUrls,
  getCategoryPageUrls,
  getHomePageUrls,
  getPostPageUrls,
  getTutorialStepPageUrls,
} from './getUrls';

describe('getSitemapEntries', () => {
  vi.mock('@/constants', async () => {
    const mod = await vi.importActual<typeof import('@/constants')>('@/constants');
    return {
      ...mod,
      IS_DEBUG: false,
      LANGUAGES_AVAILABLE_WITH_DT: mod.LANGUAGES_AVAILABLE,
    };
  });

  it('should return URLs of home page grouped by language', () => {
    const expectedUrls: ReturnType<typeof getHomePageUrls> = [
      { lang: 'fr', url: '/' },
      { lang: 'fr', url: '/fr/' },
      { lang: 'en', url: '/en/' },
    ];
    expect(getHomePageUrls()).toEqual(expectedUrls);
  });

  it.each<{
    mockPosts: Parameters<typeof getCategoryPageUrls>[0];
    expectedUrls: ReturnType<typeof getCategoryPageUrls>;
  }>([
    {
      mockPosts: [
        { lang: LanguageEnum.FR, categories: ['architecture'] },
        { lang: LanguageEnum.FR, categories: ['php'] },
        { lang: LanguageEnum.EN, categories: ['architecture'] },
        { lang: LanguageEnum.FR, contentType: ContentTypeEnum.TUTORIAL, categories: [] },
        { lang: LanguageEnum.EN, contentType: ContentTypeEnum.TUTORIAL, categories: [] },
      ] as Parameters<typeof getCategoryPageUrls>[0],
      expectedUrls: [
        [
          { lang: 'fr', url: '/fr/categories/all/' },
          { lang: 'en', url: '/en/categories/all/' },
        ],
        [{ lang: 'fr', url: '/fr/categories/php/' }],
        [
          { lang: 'fr', url: '/fr/categories/architecture/' },
          { lang: 'en', url: '/en/categories/architecture/' },
        ],
        [
          { lang: 'fr', url: '/fr/categories/tutorial/' },
          { lang: 'en', url: '/en/categories/tutorial/' },
        ],
      ],
    },
    {
      mockPosts: [
        ...Array.from({ length: 15 }).map(() => ({ lang: LanguageEnum.FR, categories: ['architecture'] })),
        ...Array.from({ length: 15 }).map(() => ({ lang: LanguageEnum.FR, categories: ['php'] })),
        ...Array.from({ length: 15 }).map(() => ({ lang: LanguageEnum.EN, categories: ['architecture'] })),
        ...Array.from({ length: 15 }).map(() => ({
          lang: LanguageEnum.FR,
          contentType: ContentTypeEnum.TUTORIAL,
          categories: [],
        })),
        { lang: LanguageEnum.EN, contentType: ContentTypeEnum.TUTORIAL, categories: [] },
      ] as Parameters<typeof getCategoryPageUrls>[0],
      expectedUrls: [
        [
          { lang: 'fr', url: '/fr/categories/all/' },
          { lang: 'en', url: '/en/categories/all/' },
        ],
        [
          { lang: 'fr', url: '/fr/categories/all/pages/1/' },
          { lang: 'en', url: '/en/categories/all/pages/1/' },
        ],
        [
          { lang: 'fr', url: '/fr/categories/all/pages/2/' },
          { lang: 'en', url: '/en/categories/all/pages/2/' },
        ],
        [{ lang: 'fr', url: '/fr/categories/all/pages/3/' }],
        [{ lang: 'fr', url: '/fr/categories/all/pages/4/' }],
        [{ lang: 'fr', url: '/fr/categories/php/' }],
        [{ lang: 'fr', url: '/fr/categories/php/pages/1/' }],
        [{ lang: 'fr', url: '/fr/categories/php/pages/2/' }],
        [
          { lang: 'fr', url: '/fr/categories/architecture/' },
          { lang: 'en', url: '/en/categories/architecture/' },
        ],
        [
          { lang: 'fr', url: '/fr/categories/architecture/pages/1/' },
          { lang: 'en', url: '/en/categories/architecture/pages/1/' },
        ],
        [
          { lang: 'fr', url: '/fr/categories/architecture/pages/2/' },
          { lang: 'en', url: '/en/categories/architecture/pages/2/' },
        ],
        [
          { lang: 'fr', url: '/fr/categories/tutorial/' },
          { lang: 'en', url: '/en/categories/tutorial/' },
        ],
        [{ lang: 'fr', url: '/fr/categories/tutorial/pages/1/' }],
        [{ lang: 'fr', url: '/fr/categories/tutorial/pages/2/' }],
      ],
    },
  ])('should return URLs of category page grouped by language', ({ mockPosts, expectedUrls }) => {
    expect(getCategoryPageUrls(mockPosts)).toEqual(expectedUrls);
  });

  it('should return URLs of author page grouped by language', () => {
    const mockPosts = [
      { lang: LanguageEnum.FR, authors: ['john'] },
      { lang: LanguageEnum.EN, authors: ['john'] },
    ];
    const expectedUrls: ReturnType<typeof getCategoryPageUrls> = [
      [
        { lang: 'fr', url: '/fr/authors/john/' },
        { lang: 'en', url: '/en/authors/john/' },
      ],
    ];
    const mockAuthors = [{ username: 'john' }];

    expect(getAuthorPageUrls(mockPosts, mockAuthors)).toEqual(expectedUrls);
  });

  it('should return URLs of post page grouped by language', () => {
    const mockPosts = [
      { lang: LanguageEnum.FR, slug: 'post-1' },
      { lang: LanguageEnum.EN, slug: 'post-2' },
    ];
    const expectedUrls: ReturnType<typeof getPostPageUrls> = [
      [{ lang: 'fr', url: '/fr/post-1/' }],
      [{ lang: 'en', url: '/en/post-2/' }],
    ];

    expect(getPostPageUrls(mockPosts)).toEqual(expectedUrls);
  });

  it('should return URLs of tutorial step page grouped by language', () => {
    const mockPosts = [
      { contentType: ContentTypeEnum.ARTICLE },
      {
        lang: LanguageEnum.FR,
        contentType: ContentTypeEnum.TUTORIAL,
        slug: 'tutorial-1',
        steps: ['introduction', 'tutorial-step', 'conclusion'],
      },
      {
        lang: LanguageEnum.EN,
        contentType: ContentTypeEnum.TUTORIAL,
        slug: 'tutorial-2',
        steps: ['introduction', 'tutorial-step', 'conclusion'],
      },
    ] as Parameters<typeof getTutorialStepPageUrls>[0];
    const expectedUrls: ReturnType<typeof getTutorialStepPageUrls> = [
      [{ lang: 'fr', url: '/fr/tutorial-1/tutorial-step/' }],
      [{ lang: 'fr', url: '/fr/tutorial-1/conclusion/' }],
      [{ lang: 'en', url: '/en/tutorial-2/tutorial-step/' }],
      [{ lang: 'en', url: '/en/tutorial-2/conclusion/' }],
    ];

    expect(getTutorialStepPageUrls(mockPosts)).toEqual(expectedUrls);
  });
});
