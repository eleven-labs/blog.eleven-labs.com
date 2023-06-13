import { globSync } from 'glob';
import { z } from 'zod';

import { AUTHORS_DIR, POSTS_DIR } from '@/app-paths';
import { AUTHORIZED_LANGUAGES, CATEGORIES } from '@/constants';
import { getDataInMarkdownFile } from '@/helpers/markdownHelper';
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

  return getDataInMarkdownFile({
    markdownFilePath: options.markdownFilePath,
    ValidationSchema: AuhorValidationSchema,
  });
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

  return getDataInMarkdownFile({
    markdownFilePath: options.markdownFilePath,
    ValidationSchema: PostValidationSchema,
  });
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
