import { getAuthors, getPosts } from '@/helpers/markdownContentManagerHelper';
import {
  getAuthorPageUrls,
  getCategoryPageUrls,
  getHomePageUrls,
  getPostPageUrls,
  getTutorialStepPageUrls,
} from '@/helpers/prerenderHelper/getUrls';

type Link = {
  lang: string;
  url: string;
};

type SitemapEntry = {
  links: Link[];
  changefreq?: string;
  priority: number;
};

export const getSitemapEntries = (): SitemapEntry[] => {
  const posts = getPosts();
  const authors = getAuthors();

  const rootEntry: SitemapEntry = {
    priority: 0.8,
    links: getHomePageUrls(),
  };

  const categoryPageUrls = getCategoryPageUrls(posts);
  const categoryEntries: SitemapEntry[] = categoryPageUrls.map((urls) => ({
    priority: 0.7,
    links: urls,
  }));

  const authorPageUrls = getAuthorPageUrls(posts, authors);
  const authorEntries: SitemapEntry[] = authorPageUrls.map((urls) => ({
    priority: 0.5,
    links: urls,
  }));

  const postPageUrls = getPostPageUrls(posts);
  const postEntries: SitemapEntry[] = postPageUrls.map((urls) => ({
    priority: 1,
    links: urls,
  }));

  const tutorialStepUrls = getTutorialStepPageUrls(posts);
  const tutorialStepEntries: SitemapEntry[] = tutorialStepUrls.map((urls) => ({
    priority: 0.9,
    links: urls,
  }));

  return [rootEntry, ...categoryEntries, ...authorEntries, ...postEntries, ...tutorialStepEntries].sort(
    (a, b) => b?.priority - a?.priority
  );
};
