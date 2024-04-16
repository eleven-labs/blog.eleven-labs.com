import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as xml2js from 'xml2js';

import { DEFAULT_LANGUAGE } from '@/constants';
import { generateUrl } from '@/helpers/assetHelper';

export const getSitemap = (
  sitemapEntries: { links: { lang: string; url: string }[]; changefreq?: string; priority?: number }[]
): string => {
  const builder = new xml2js.Builder();
  return builder.buildObject({
    urlset: {
      $: {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        'xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
        'xmlns:news': 'http://www.google.com/schemas/sitemap-news/0.9',
      },
      url: sitemapEntries.map(({ links, priority, changefreq }) => {
        const defaultLink = links.find((link) => link.lang === DEFAULT_LANGUAGE) ?? links[0];
        return {
          loc: generateUrl(defaultLink.url),
          ...(changefreq ? { changefreq } : {}),
          priority: priority?.toFixed(1) ?? 0.3,
          ...(links.length > 1
            ? {
                'xhtml:link': links.map((link) => ({
                  $: {
                    href: generateUrl(link.url),
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
};

export const generateSitemap = async (options: {
  rootDir: string;
  sitemapEntries: { links: { lang: string; url: string }[]; changefreq?: string; priority?: number }[];
}): Promise<void> => {
  const sitemap = getSitemap(options.sitemapEntries);
  writeFileSync(resolve(options.rootDir, 'sitemap.xml'), sitemap, 'utf8');
};
