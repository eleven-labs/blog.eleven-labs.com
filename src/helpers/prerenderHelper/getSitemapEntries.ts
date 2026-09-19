import type { SitemapEntry } from '@/helpers/prerenderHelper/generateSitemap';

import { MARKDOWN_CONTENT_TYPES, PATHS } from '@/constants';
import { getAuthors, getPosts } from '@/helpers/markdownContentManagerHelper';
import {
  getAuthorPageUrls,
  getCategoryPageUrls,
  getHomePageUrls,
  getPostPageUrls,
  getTutorialStepPageUrls,
} from '@/helpers/prerenderHelper/getUrls';
import { generatePath } from '@/helpers/routerHelper';

export const getSitemapEntries = (): SitemapEntry[] => {
  const posts = getPosts();
  const authors = getAuthors();

  // Google relies on lastmod to schedule its recrawls, unlike priority and changefreq
  const lastmodByUrl = new Map<string, string>();
  for (const post of posts) {
    const lastmod = (post.updatedAt ?? post.date).slice(0, 10);
    lastmodByUrl.set(generatePath(PATHS.POST, { lang: post.lang, slug: post.slug }), lastmod);
    if (post.contentType === MARKDOWN_CONTENT_TYPES.TUTORIAL) {
      for (const step of post.steps.slice(1)) {
        lastmodByUrl.set(generatePath(PATHS.POST, { lang: post.lang, slug: post.slug, step: step.slug }), lastmod);
      }
    }
  }
  const getLastmod = (links: { url: string }[]): string | undefined => lastmodByUrl.get(links[0].url);

  const rootEntry: SitemapEntry = {
    priority: 0.8,
    links: getHomePageUrls(),
    changefreq: 'weekly',
  };

  const categoryPageUrls = getCategoryPageUrls(posts);
  const categoryEntries: SitemapEntry[] = categoryPageUrls.map((urls) => ({
    priority: 0.7,
    links: urls,
    changefreq: 'weekly',
  }));

  const authorPageUrls = getAuthorPageUrls(posts, authors);
  const authorEntries: SitemapEntry[] = authorPageUrls.map((urls) => ({
    priority: 0.5,
    links: urls,
  }));

  const postPageUrls = getPostPageUrls(posts);
  const postEntries: SitemapEntry[] = postPageUrls.map((urls) => ({
    priority: 1,
    lastmod: getLastmod(urls),
    links: urls,
  }));

  const tutorialStepUrls = getTutorialStepPageUrls(posts);
  const tutorialStepEntries: SitemapEntry[] = tutorialStepUrls.map((urls) => ({
    priority: 0.9,
    lastmod: getLastmod(urls),
    links: urls,
  }));

  return [rootEntry, ...categoryEntries, ...authorEntries, ...postEntries, ...tutorialStepEntries].sort(
    (a, b) => (b?.priority ?? 0) - (a?.priority ?? 0)
  );
};
