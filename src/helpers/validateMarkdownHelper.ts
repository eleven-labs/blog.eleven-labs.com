import { globSync } from 'glob';
import matter from 'gray-matter';
import { readFileSync } from 'node:fs';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

import { AUTHORS_DIR, POSTS_DIR } from '@/app-paths';
import { AUTHORIZED_LANGUAGES, CATEGORIES } from '@/constants';
import { intersection } from '@/helpers/objectHelper';
import { AuthorData, PostData } from '@/types';

export const validateAuthor = (options: { markdownFilePath: string }): AuthorData & { content: string } => {
  const AuhorValidationSchema = z
    .object({
      username: z.string(),
      name: z.string(),
      twitter: z.string().optional(),
      github: z.string().optional(),
      linkedin: z.string().optional(),
    })
    .strict();

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
}): Omit<PostData, 'date'> & { date: Date; content: string } => {
  const PostValidationSchema = z
    .object({
      lang: z.enum(AUTHORIZED_LANGUAGES),
      date: z.coerce.date(),
      slug: z.string(),
      title: z.string(),
      excerpt: z.string(),
      cover: z.string().optional(),
      authors: z.array(z.enum(options.authors)),
      categories: z.array(z.enum(CATEGORIES)),
      keywords: z
        .array(z.string())
        .superRefine((val, ctx) => {
          if (intersection(val, CATEGORIES).length) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Must not include a category.',
            });
          }

          if (val.length > 10) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_big,
              maximum: 10,
              type: 'array',
              inclusive: true,
              message: 'Too many items 😡.',
            });
          }

          if (val.length !== new Set(val).size) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'No duplicates allowed.',
            });
          }
        })
        .optional(),
    })
    .strict();

  const markdownContent = readFileSync(options.markdownFilePath, { encoding: 'utf-8' });

  if (markdownContent.match(/{:[^}]+}/)) {
    throw new Error(
      `The markdown of the file "${options.markdownFilePath}" is not compliant, it contains a syntax that is not allowed !`
    );
  }

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
    if (authors.includes(author.username)) {
      throw new Error('This author already exists with the same username !');
    }
    authors.push(author.username);
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
