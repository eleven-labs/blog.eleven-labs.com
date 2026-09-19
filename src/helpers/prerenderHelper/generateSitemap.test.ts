import { HOST_URL } from '@/constants';

import { getSitemap } from './generateSitemap';

describe('getSitemap', () => {
  test('should use the default language url as loc and keep a single url per language', () => {
    const sitemap = getSitemap([
      {
        priority: 0.8,
        changefreq: 'weekly',
        links: [
          { lang: 'fr', url: '/fr/' },
          { lang: 'en', url: '/en/' },
          { lang: 'fr', url: '/' },
        ],
      },
    ]);

    expect(sitemap).toContain(`<loc>${HOST_URL}/fr/</loc>`);
    expect(sitemap).toContain(`href="${HOST_URL}/fr/" hreflang="fr" rel="alternate"`);
    expect(sitemap).toContain(`href="${HOST_URL}/en/" hreflang="en" rel="alternate"`);
    expect(sitemap).toContain(`href="${HOST_URL}/fr/" hreflang="x-default" rel="alternate"`);
    expect(sitemap).not.toContain(`href="${HOST_URL}/" hreflang="fr"`);
  });

  test('should expose the lastmod when it is known', () => {
    const sitemap = getSitemap([{ priority: 1, lastmod: '2025-06-02', links: [{ lang: 'fr', url: '/fr/post-1/' }] }]);

    expect(sitemap).toContain('<lastmod>2025-06-02</lastmod>');
  });

  test('should not add alternate links when the page exists in a single language', () => {
    const sitemap = getSitemap([{ priority: 1, links: [{ lang: 'fr', url: '/fr/post-1/' }] }]);

    expect(sitemap).toContain(`<loc>${HOST_URL}/fr/post-1/</loc>`);
    expect(sitemap).not.toContain('xhtml:link');
    expect(sitemap).not.toContain('x-default');
  });
});
