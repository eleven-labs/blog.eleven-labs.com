import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as xml2js from 'xml2js';

import { blogUrl } from '@/config/website';
import { DEFAULT_LANGUAGE } from '@/constants';

export const generateSitemap = async (options: {
  rootDir: string;
  sitemapEntries: { links: { lang: string; url: string }[]; changefreq?: string; priority?: number }[];
}): Promise<void> => {
  const builder = new xml2js.Builder();
  const sitemapContent = builder.buildObject({
    urlset: {
      $: {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        'xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
        'xmlns:news': 'http://www.google.com/schemas/sitemap-news/0.9',
      },
      url: options.sitemapEntries.map(({ links, priority, changefreq }) => {
        const defaultLink = links.find((link) => link.lang === DEFAULT_LANGUAGE) ?? links[0];
        return {
          loc: `${blogUrl}${defaultLink.url}`,
          changefreq: changefreq ?? 'weekly',
          priority: priority?.toFixed(1) ?? 0.3,
          ...(links.length > 1
            ? {
                'xhtml:link': links.map((link) => ({
                  $: {
                    href: `${blogUrl}${link.url}`,
                    hreflang: link.lang,
                    rel: 'alternate',
                  },
                })),
              }
            : {}),
        };
      }),
    },
  });

  writeFileSync(resolve(options.rootDir, 'sitemap.xml'), sitemapContent, 'utf8');
};
