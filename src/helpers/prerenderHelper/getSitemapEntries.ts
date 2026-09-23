import type { SitemapEntry } from '@/helpers/prerenderHelper/generateSitemap';

import { PATHS } from '@/constants';
import { getPosts } from '@/helpers/markdownContentManagerHelper';
import { getCategoryPageUrls, getHomePageUrls, getPostPageUrls } from '@/helpers/prerenderHelper/getUrls';
import { generatePath } from '@/helpers/routerHelper';

export const getSitemapEntries = (): SitemapEntry[] => {
  const posts = getPosts();

  // Google relies on lastmod to schedule its recrawls, it ignores priority and changefreq
  const lastmodByUrl = new Map<string, string>();
  for (const post of posts) {
    const lastmod = (post.updatedAt ?? post.date).slice(0, 10);
    lastmodByUrl.set(generatePath(PATHS.POST, { lang: post.lang, slug: post.slug }), lastmod);
  }
  const getLastmod = (links: { url: string }[]): string | undefined => lastmodByUrl.get(links[0].url);

  const toSitemapEntry = (links: { lang: string; url: string }[]): SitemapEntry => ({
    lastmod: getLastmod(links),
    links,
  });

  // The author pages are not indexed and the steps of a tutorial are sections of its page,
  // they have no place in the sitemap
  return [getHomePageUrls(), ...getCategoryPageUrls(posts), ...getPostPageUrls(posts)].map(toSitemapEntry);
};
