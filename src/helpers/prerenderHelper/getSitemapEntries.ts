import { DEVICES, IMAGE_FORMATS, PATHS } from '@/constants';
import { getCoverPath } from '@/helpers/assetHelper';
import { getAuthors, getPosts } from '@/helpers/markdownContentManagerHelper';
import {
  getAuthorPageUrls,
  getCategoryPageUrls,
  getHomePageUrls,
  getTutorialStepPageUrls,
} from '@/helpers/prerenderHelper/getUrls';
import { generatePath } from '@/helpers/routerHelper';

export interface SitemapEntry {
  links: {
    lang: string;
    url: string;
  }[];
  image?: {
    url: string;
    description?: string;
  };
  lastModified?: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const getSitemapEntries = (): SitemapEntry[] => {
  const posts = getPosts();
  const authors = getAuthors();

  const rootEntry: SitemapEntry = {
    links: getHomePageUrls(),
    changeFrequency: 'weekly',
  };

  const categoryPageUrls = getCategoryPageUrls(posts);
  const categoryEntries: SitemapEntry[] = categoryPageUrls.map((urls) => ({
    links: urls,
    changeFrequency: 'weekly',
  }));

  const authorPageUrls = getAuthorPageUrls(posts, authors);
  const authorEntries: SitemapEntry[] = authorPageUrls.map((urls) => ({
    links: urls,
  }));

  const postEntries: SitemapEntry[] = posts.map((post) => ({
    links: [
      {
        lang: post.lang,
        url: generatePath(PATHS.POST, { lang: post.lang, slug: post.slug }),
      },
    ],
    lastModified: post.date,
    image: post.cover?.path
      ? {
          url: getCoverPath({
            path: post.cover?.path,
            format: IMAGE_FORMATS.HIGHLIGHTED_TUTORIAL_POST_CARD_COVER,
            pixelRatio: 2,
            device: DEVICES.DESKTOP,
            position: post.cover.position,
          }),
          description: post.cover?.alt,
        }
      : undefined,
  }));

  const tutorialStepUrls = getTutorialStepPageUrls(posts);
  const tutorialStepEntries: SitemapEntry[] = tutorialStepUrls.map((urls) => ({
    links: urls,
  }));

  return [...postEntries, rootEntry, ...categoryEntries, ...authorEntries, ...tutorialStepEntries];
};
