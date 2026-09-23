import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as xml2js from 'xml2js';

import { DEFAULT_LANGUAGE } from '@/constants';
import { generateUrl } from '@/helpers/assetHelper';

export type SitemapEntry = {
  links: { lang: string; url: string }[];
  lastmod?: string;
};

export const getSitemap = (sitemapEntries: SitemapEntry[]): string => {
  const builder = new xml2js.Builder();
  return builder.buildObject({
    urlset: {
      $: {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        'xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
      },
      url: sitemapEntries.map(({ links, lastmod }) => {
        const defaultLink = links.find((link) => link.lang === DEFAULT_LANGUAGE) ?? links[0];
        const alternateLinks = links.filter(
          (link, index) => links.findIndex((currentLink) => currentLink.lang === link.lang) === index
        );
        return {
          loc: generateUrl(defaultLink.url),
          ...(lastmod ? { lastmod } : {}),
          ...(alternateLinks.length > 1
            ? {
                'xhtml:link': [...alternateLinks, { lang: 'x-default', url: defaultLink.url }].map((link) => ({
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

export const generateSitemap = (options: { rootDir: string; sitemapEntries: SitemapEntry[] }): void => {
  const sitemap = getSitemap(options.sitemapEntries);
  writeFileSync(resolve(options.rootDir, 'sitemap.xml'), sitemap, 'utf8');
};
