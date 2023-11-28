import { globSync } from 'glob';
import matter from 'gray-matter';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

import { ASSETS_DIR, MARKDOWN_FILE_PATHS } from '@/app-paths';
import { ContentTypeEnum } from '@/constants';
import { getPathFile } from '@/helpers/assetHelper';
import { markdownToHtml as defaultMarkdownToHtml } from '@/helpers/markdownToHtmlHelper';
import {
  ArticleData,
  AuthorData,
  ResultData,
  TransformedArticleData,
  TransformedAuthorData,
  TransformedPostData,
  TransformedTutorialData,
  TutorialData,
  TutorialStepData,
} from '@/types';

interface MarkdownCacheData<TData = ResultData> {
  data: TData;
  content: string;
  html: string;
  mtime?: number;
}

const markdownCache: Map<string, MarkdownCacheData> = new Map<string, MarkdownCacheData>();

const frontmatter = <TData = { [p: string]: unknown }>(
  content: string
): Omit<matter.GrayMatterFile<string>, 'data'> & { data: TData } => {
  return matter(content) as Omit<matter.GrayMatterFile<string>, 'data'> & { data: TData };
};

export const loadDataByMarkdownFilePath = ({
  filePath,
  markdownToHtml = defaultMarkdownToHtml,
}: {
  filePath: string;
  markdownToHtml?: (content: string) => string;
}): MarkdownCacheData['data'] | undefined => {
  const stat = statSync(filePath);
  const cached = markdownCache.get(filePath);
  if (cached && cached.mtime === stat.mtimeMs) {
    return cached.data;
  }
  const markdownContent = readFileSync(filePath, { encoding: 'utf-8' });

  const { data, content } = frontmatter<MarkdownCacheData['data']>(markdownContent);
  markdownCache.set(filePath, { data, content, html: markdownToHtml(content), mtime: stat.mtimeMs });

  return markdownCache.get(filePath)?.data;
};

const getCollection = <TData = ResultData>(
  contentType: MarkdownCacheData['data']['contentType']
): MarkdownCacheData<TData>[] => {
  for (const filePath of MARKDOWN_FILE_PATHS) {
    loadDataByMarkdownFilePath({ filePath });
  }

  return Array.from(markdownCache.values()).filter(
    (markdownCacheResult) => markdownCacheResult.data.contentType === contentType
  ) as MarkdownCacheData<TData>[];
};

const getReadingTime = (content: string): number => {
  const numberOfWords = content.split(' ').length;
  return numberOfWords < 360 ? 1 : Math.round(numberOfWords / 180);
};

export const getAuthors = (): TransformedAuthorData[] =>
  getCollection<AuthorData>(ContentTypeEnum.AUTHOR).reduce<TransformedAuthorData[]>(
    (currentAuthors, { data, html }) => {
      const avatarImageFileNames = globSync(`${data.username}.*`, { cwd: resolve(ASSETS_DIR, 'authors') });
      currentAuthors.push({
        username: data.username,
        name: data.name,
        avatarImageUrl:
          avatarImageFileNames.length > 0 ? getPathFile(`/imgs/authors/${avatarImageFileNames[0]}`) : undefined,
        socialNetworks:
          data.github || data.twitter || data.linkedin
            ? {
                github: data.github,
                twitter: data.twitter,
                linkedin: data.linkedin,
              }
            : undefined,
        content: html,
      });
      return currentAuthors;
    },
    []
  );

export const getArticles = (): TransformedArticleData[] =>
  getCollection<ArticleData>(ContentTypeEnum.ARTICLE).reduce<TransformedArticleData[]>(
    (currentArticles, { data, content, html }) => {
      currentArticles.push({
        contentType: data.contentType,
        lang: data.lang,
        slug: data.slug,
        date: new Date(data.date).toISOString(),
        title: data.title,
        excerpt: data.excerpt,
        cover: data.cover ? `${process.env.BASE_URL || '/'}${data.cover.substring(1)}` : undefined,
        readingTime: getReadingTime(content),
        authors: data.authors,
        categories: data.categories,
        content: html,
      });
      return currentArticles;
    },
    []
  );

export const getTutorials = (): TransformedTutorialData[] => {
  const tutorialSteps = getCollection<TutorialStepData>(ContentTypeEnum.TUTORIAL_STEP);
  return getCollection<TutorialData>(ContentTypeEnum.TUTORIAL).reduce<TransformedTutorialData[]>(
    (currentTutorials, { data }) => {
      const steps = data.steps.reduce<TransformedTutorialData['steps']>((currentSteps, step) => {
        const currentStep = tutorialSteps.find(
          (tutorialStep) => tutorialStep.data.tutorial === data.slug && tutorialStep.data.slug === step
        );
        if (currentStep) {
          currentSteps.push({
            slug: currentStep.data.slug,
            title: currentStep.data?.title,
            readingTime: getReadingTime(currentStep.content),
            content: currentStep.html,
          });
        }

        return currentSteps;
      }, []);
      currentTutorials.push({
        contentType: data.contentType,
        lang: data.lang,
        slug: data.slug,
        date: new Date(data.date).toISOString(),
        title: data.title,
        excerpt: data.excerpt,
        readingTime: steps.reduce((currentReadingTime, step) => currentReadingTime + getReadingTime(step.content), 0),
        authors: data.authors,
        categories: data.categories,
        steps,
      });
      return currentTutorials;
    },
    []
  );
};

export const getPosts = (): TransformedPostData[] => {
  const articles = getArticles();
  const tutorials = getTutorials();
  return [...articles, ...tutorials];
};
