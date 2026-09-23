import { HOST_URL } from '@/constants';

import { getSitemap } from './generateSitemap';

describe('getSitemap', () => {
  test('should use the default language url as loc and keep a single url per language', () => {
    const sitemap = getSitemap([
      {
        links: [
          { lang: 'fr', url: '/fr/post-1/' },
          { lang: 'en', url: '/en/post-1/' },
          { lang: 'fr', url: '/fr/post-1-duplicate/' },
        ],
      },
    ]);

    expect(sitemap).toContain(`<loc>${HOST_URL}/fr/post-1/</loc>`);
    expect(sitemap).toContain(`href="${HOST_URL}/fr/post-1/" hreflang="fr" rel="alternate"`);
    expect(sitemap).toContain(`href="${HOST_URL}/en/post-1/" hreflang="en" rel="alternate"`);
    expect(sitemap).toContain(`href="${HOST_URL}/fr/post-1/" hreflang="x-default" rel="alternate"`);
    expect(sitemap).not.toContain('/fr/post-1-duplicate/');
  });

  test('should keep the root as the url of the home in the default language', () => {
    const sitemap = getSitemap([
      {
        links: [
          { lang: 'fr', url: '/' },
          { lang: 'en', url: '/en/' },
        ],
      },
    ]);

    expect(sitemap).toContain(`<loc>${HOST_URL}/</loc>`);
    expect(sitemap).toContain(`href="${HOST_URL}/" hreflang="fr" rel="alternate"`);
    expect(sitemap).toContain(`href="${HOST_URL}/" hreflang="x-default" rel="alternate"`);
    expect(sitemap).not.toContain(`${HOST_URL}/fr/`);
  });

  test('should expose the lastmod when it is known', () => {
    const sitemap = getSitemap([{ lastmod: '2025-06-02', links: [{ lang: 'fr', url: '/fr/post-1/' }] }]);

    expect(sitemap).toContain('<lastmod>2025-06-02</lastmod>');
  });

  test('should not add alternate links when the page exists in a single language', () => {
    const sitemap = getSitemap([{ links: [{ lang: 'fr', url: '/fr/post-1/' }] }]);

    expect(sitemap).toContain(`<loc>${HOST_URL}/fr/post-1/</loc>`);
    expect(sitemap).not.toContain('xhtml:link');
    expect(sitemap).not.toContain('x-default');
  });

  test('should not declare priority nor changefreq, ignored by Google', () => {
    const sitemap = getSitemap([{ links: [{ lang: 'fr', url: '/fr/post-1/' }] }]);

    expect(sitemap).not.toContain('<priority>');
    expect(sitemap).not.toContain('<changefreq>');
  });
});
