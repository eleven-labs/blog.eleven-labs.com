import { globSync } from 'glob';
import matter from 'gray-matter';
import { readFileSync } from 'node:fs';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

import { AUTHORS_DIR, POSTS_DIR } from '@/app-paths';
import { AUTHORIZED_LANGUAGES, CATEGORIES } from '@/constants';
import { AuthorType, PostType } from '@/types';

export const validateAuthor = (options: {
  markdownFilePath: string;
}): Omit<AuthorType, 'layout' | 'permalink'> & { content: string } => {
  const AuhorValidationSchema = z.object({
    login: z.string(),
    title: z.string(),
    twitter: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
  });

  const markdownContent = readFileSync(options.markdownFilePath, { encoding: 'utf-8' });
  const matterResult = matter(markdownContent);
  const result = AuhorValidationSchema.safeParse(matterResult.data);
  if (!result.success) {
    const validationError = fromZodError(result.error);
    throw new Error(`The markdown of the file "${options.markdownFilePath}" is invalid ! ${validationError.message}`);
  }
  return { ...result.data, content: matterResult.content };
};

export const validatePost = (options: {
  authors: [string, ...string[]];
  markdownFilePath: string;
}): Omit<PostType, 'layout' | 'permalink' | 'date'> & { date: Date; content: string } => {
  const PostValidationSchema = z.object({
    lang: z.enum(AUTHORIZED_LANGUAGES),
    date: z.coerce.date(),
    slug: z.string(),
    title: z.string(),
    excerpt: z.string(),
    cover: z.string().optional(),
    authors: z.array(z.enum(options.authors)),
    categories: z.array(z.enum(CATEGORIES)),
  });

  const markdownContent = readFileSync(options.markdownFilePath, { encoding: 'utf-8' });
  const matterResult = matter(markdownContent);
  const result = PostValidationSchema.safeParse(matterResult.data);
  if (!result.success) {
    const validationError = fromZodError(result.error);
    throw new Error(`The markdown of the file "${options.markdownFilePath}" is invalid ! ${validationError.message}`);
  }
  return { ...result.data, content: matterResult.content };
};

export const validateMarkdown = (): boolean => {
  const authorMarkdownFilePaths = globSync(`${AUTHORS_DIR}/**/*.md`);
  const postMarkdownFilePaths = globSync(`${POSTS_DIR}/**/*.md`);

  const authors: string[] = [];

  for (const markdownFilePath of authorMarkdownFilePaths) {
    const author = validateAuthor({ markdownFilePath });
    if (authors.includes(author.login)) {
      throw new Error('This author already exists with the same username !');
    }
    authors.push(author.login);
  }

  const postIds: string[] = [];

  for (const markdownFilePath of postMarkdownFilePaths) {
    const post = validatePost({ authors: authors as [string, ...string[]], markdownFilePath });
    const postId = `${post.lang}-${post.slug}`;
    if (postIds.includes(postId)) {
      throw new Error('This article already exists with the same slug and the same language !');
    }
    postIds.push(postId);
  }

  return true;
};
