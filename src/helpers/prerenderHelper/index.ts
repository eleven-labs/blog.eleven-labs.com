import { resolve } from 'node:path';

import { DEFAULT_LANGUAGE, LanguageEnum, PATHS } from '@/constants';
import { generatePath } from '@/helpers/routerHelper';

import { generateFeedFile } from './generateFeedFile';
import { generateHtmlFiles } from './generateHtmlFiles';
import { generateSitemap } from './generateSitemap';
import { getSitemapEntries } from './getSitemapEntries';

export const generateFiles = async (options: { rootDir: string; baseUrl: string }): Promise<void> => {
  const __dirname = resolve(options.rootDir, 'public');
  const sitemapEntries = getSitemapEntries();

  const urls: { lang: string; url: string }[] = sitemapEntries
    .map((sitemapEntry) => sitemapEntry.links)
    .flat()
    .map((param) => ({
      lang: param.lang,
      url: param.url,
    }));

  urls.push(
    ...Object.values(LanguageEnum).map((lang) => ({
      lang,
      url: generatePath(PATHS.SEARCH, { lang }),
    })),
    {
      lang: DEFAULT_LANGUAGE,
      url: generatePath('/404', {}),
    }
  );

  await Promise.all([
    generateHtmlFiles({
      rootDir: __dirname,
      baseUrl: options.baseUrl,
      urls,
    }),
    generateSitemap({
      rootDir: __dirname,
      sitemapEntries,
    }),
  ]);
  generateFeedFile({ rootDir: __dirname });

  console.log('🦖🖨 Your static site is ready to deploy from dist');
};
