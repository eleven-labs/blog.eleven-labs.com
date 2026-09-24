import type {
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

import GithubSlugger from 'github-slugger';
import { globSync } from 'glob';
import matter from 'gray-matter';
import { toString } from 'mdast-util-to-string';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

import { ASSETS_DIR, MARKDOWN_FILE_PATHS } from '@/app-paths';
import { MARKDOWN_CONTENT_TYPES } from '@/constants';
import { getPathFile } from '@/helpers/assetHelper';
import {
  type ContentFormat,
  markdownToHtml as defaultMarkdownToHtml,
  getContentFormat,
  type MarkdownToHtmlOptions,
} from '@/helpers/markdownToHtmlHelper';

interface MarkdownCacheData<TData = ResultData> {
  data: TData;
  content: string;
  format: ContentFormat;
  html: string;
  mtime?: number;
}

const markdownCache: Map<string, MarkdownCacheData> = new Map<string, MarkdownCacheData>();

const frontmatter = <TData = { [p: string]: unknown }>(
  content: string
): Omit<matter.GrayMatterFile<string>, 'data'> & { data: TData } => {
  return matter(content) as Omit<matter.GrayMatterFile<string>, 'data'> & { data: TData };
};

export const extractHeaders = (
  markdownContent: string,
  format: ContentFormat = 'md'
): { id: string; level: number; text: string }[] => {
  const slugger = new GithubSlugger();
  const ast = unified()
    .use(remarkParse)
    .use(format === 'mdx' ? [remarkMdx] : [])
    .parse(markdownContent);

  const headers: { id: string; level: number; text: string }[] = [];
  visit(ast, 'heading', (node) => {
    const value = toString(node, { includeImageAlt: false });
    headers.push({
      id: slugger.slug(value),
      level: node.depth,
      text: value,
    });
  });

  return headers;
};

export const loadDataByMarkdownFilePath = ({
  filePath,
  markdownToHtml = defaultMarkdownToHtml,
}: {
  filePath: string;
  markdownToHtml?: (content: string, options?: MarkdownToHtmlOptions) => string;
}): MarkdownCacheData['data'] | undefined => {
  const stat = statSync(filePath);
  const cached = markdownCache.get(filePath);
  if (cached && cached.mtime === stat.mtimeMs) {
    return cached.data;
  }
  const markdownContent = readFileSync(filePath, { encoding: 'utf-8' });

  const { data, content } = frontmatter<MarkdownCacheData['data']>(markdownContent);
  const format = getContentFormat(filePath);
  markdownCache.set(filePath, { data, content, format, html: markdownToHtml(content, { format }), mtime: stat.mtimeMs });

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
  getCollection<AuthorData>(MARKDOWN_CONTENT_TYPES.AUTHOR).reduce<TransformedAuthorData[]>(
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
  getCollection<ArticleData>(MARKDOWN_CONTENT_TYPES.ARTICLE).reduce<TransformedArticleData[]>(
    (currentArticles, { data, content, format, html }) => {
      currentArticles.push({
        ...data,
        date: new Date(data.date).toISOString(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : undefined,
        summary: extractHeaders(content, format),
        readingTime: getReadingTime(content),
        content: html,
      });
      return currentArticles;
    },
    []
  );

export const getTutorials = (): TransformedTutorialData[] => {
  const tutorialSteps = getCollection<TutorialStepData>(MARKDOWN_CONTENT_TYPES.TUTORIAL_STEP);
  return getCollection<TutorialData>(MARKDOWN_CONTENT_TYPES.TUTORIAL).reduce<TransformedTutorialData[]>(
    (currentTutorials, { data }) => {
      // Every step is a section of the tutorial page: the slug of a step is the id of its section,
      // no heading of any step can take it over
      const slugger = new GithubSlugger();
      for (const step of data.steps) {
        slugger.slug(step);
      }
      const steps = data.steps.reduce<TransformedTutorialData['steps']>((currentSteps, step) => {
        const currentStep = tutorialSteps.find(
          (tutorialStep) => tutorialStep.data.tutorial === data.slug && tutorialStep.data.slug === step
        );
        if (currentStep) {
          currentSteps.push({
            slug: currentStep.data.slug,
            title: currentStep.data?.title,
            readingTime: getReadingTime(currentStep.content),
            content: defaultMarkdownToHtml(currentStep.content, {
              format: currentStep.format,
              section: { title: currentStep.data.title, slugger },
            }),
          });
        }

        return currentSteps;
      }, []);
      currentTutorials.push({
        ...data,
        date: new Date(data.date).toISOString(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : undefined,
        readingTime: steps.reduce((currentReadingTime, step) => currentReadingTime + getReadingTime(step.content), 0),
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
