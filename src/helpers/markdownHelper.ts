import { globSync } from 'glob';
import matter from 'gray-matter';
import { YAMLException } from 'js-yaml';
import { existsSync, readFileSync } from 'node:fs';
import * as path from 'path';
import { z, ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

import { ASSETS_DIR, AUTHORS_DIR, POSTS_DIR } from '@/app-paths';
import { AUTHORIZED_LANGUAGES, CATEGORIES } from '@/constants';
import { intersection } from '@/helpers/objectHelper';
import { capitalize } from '@/helpers/stringHelper';
import { AuthorData, PostData } from '@/types';

export class MarkdownInvalidError extends Error {
  markdownFilePathRelative: string;
  reason: string;
  line?: number;
  column?: number;

  constructor(options: { markdownFilePath: string; reason: string; line?: number; column?: number }) {
    const globalMessage = `The markdown of the file "${options.markdownFilePath}" is invalid ! ${capitalize(
      options.reason
    )}`;
    super(globalMessage);
    this.markdownFilePathRelative = path.relative(process.cwd(), options.markdownFilePath);
    this.reason = options.reason;
    this.line = options.line;
    this.column = options.column;
  }
}

export const frontmatter = <TData = { [p: string]: unknown }>(
  content: string
): Omit<matter.GrayMatterFile<string>, 'data'> & { data: TData } => {
  return matter(content) as Omit<matter.GrayMatterFile<string>, 'data'> & { data: TData };
};

export const getDataInMarkdownFile = <TData = { [p: string]: unknown }>(options: {
  markdownFilePath: string;
  ValidationSchema: ZodSchema;
}): TData & { content: string } => {
  const markdownContent = readFileSync(options.markdownFilePath, { encoding: 'utf-8' });

  const invalidSyntaxMatches = markdownContent.match(/`{1,3}[\s\S]*?`{1,3}|{% raw %}|{% endraw %}|{:[^}]+}}?/g);
  if (invalidSyntaxMatches) {
    for (const invalidSyntaxMatch of invalidSyntaxMatches) {
      if (!/^`{1,3}/.test(invalidSyntaxMatch)) {
        throw new MarkdownInvalidError({
          markdownFilePath: options.markdownFilePath,
          reason: `The syntax isn't allowed, please use valid markdown syntax ! ${invalidSyntaxMatch}`,
        });
      }
    }
  }

  try {
    const frontmatterResult = matter(markdownContent);

    const result = options.ValidationSchema.safeParse(frontmatterResult.data);

    if (!result.success) {
      const validationError = fromZodError(result.error);

      throw new MarkdownInvalidError({
        markdownFilePath: options.markdownFilePath,
        reason: validationError.message.replace('Validation error: ', ''),
      });
    }

    return { ...result.data, content: frontmatterResult.content };
  } catch (error) {
    if (error instanceof MarkdownInvalidError) {
      throw error;
    }
    const yamlException = error as YAMLException;

    throw new MarkdownInvalidError({
      markdownFilePath: options.markdownFilePath,
      reason: (error as Error)?.message,
      line: yamlException?.mark?.line,
      column: yamlException?.mark?.column,
    });
  }
};

export const validateMarkdownContent = (options: { markdownFilePath: string; content: string }): string => {
  const imgTagMatches = options.content.match(/`{3}[\s\S]*?`{3}|`{1}[\s\S]*?`{1}|<img[^>]*>/g);
  if (imgTagMatches) {
    for (const imgTagMatch of imgTagMatches) {
      if (!/^`{1,3}/.test(imgTagMatch)) {
        console.log(`The img tag are no longer allowed, please use markdown syntax ! ${imgTagMatch}`);
        throw new MarkdownInvalidError({
          markdownFilePath: options.markdownFilePath,
          reason: `The img tag are no longer allowed, please use markdown syntax ! ${imgTagMatch}`,
        });
      }
    }
  }

  const assetMatches = options.content.match(/{{ site.baseurl }}[^)"'\s]+/g);
  if (assetMatches) {
    for (const assetMatch of assetMatches) {
      const assetPath = assetMatch.replace(/{{\s*?site.baseurl\s*?}}\/assets/g, `${ASSETS_DIR}/posts`).split('?')?.[0];

      if (!existsSync(assetPath)) {
        throw new MarkdownInvalidError({
          markdownFilePath: options.markdownFilePath,
          reason: `The file does not exist "${assetPath}"!`,
        });
      }
    }
  }

  return options.content;
};

export const validateAuthor = (options: { markdownFilePath: string }): AuthorData & { content: string } => {
  const AuhorValidationSchema = z
    .object({
      username: z.string().regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/, 'Kebab case format not respected'),
      name: z.string(),
      twitter: z
        .string()
        .superRefine((val, ctx) => {
          const pattern = /^https:\/\/twitter.com\/[a-z0-9_-]+\/?$/i;
          if (pattern.test(val)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'No need to define the complete url of twitter, just give the user name',
            });
          }
          if (val.startsWith('@')) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'No need to set the "@" for twitter, just the username.',
            });
          }
        })
        .optional(),
      github: z
        .string()
        .superRefine((val, ctx) => {
          const pattern = /^https:\/\/github.com\/[a-z0-9_-]+\/?$/i;
          if (pattern.test(val)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'No need to define the complete url of github, just give the user name',
            });
          }
        })
        .optional(),
      linkedin: z
        .string()
        .superRefine((val, ctx) => {
          const pattern = /^https:\/\/www.linkedin.com\/in\/[a-z0-9_-]+\/?$/i;
          if (pattern.test(val)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'No need to define the complete url of linkedin, just give the user name',
            });
          }
        })
        .optional(),
    })
    .strict();

  const { content, ...data } = getDataInMarkdownFile<z.infer<typeof AuhorValidationSchema>>({
    markdownFilePath: options.markdownFilePath,
    ValidationSchema: AuhorValidationSchema,
  });

  return {
    ...data,
    content: validateMarkdownContent({
      markdownFilePath: options.markdownFilePath,
      content,
    }),
  };
};

export const validatePost = (options: {
  authors: [string, ...string[]];
  markdownFilePath: string;
}): Omit<PostData, 'date'> & { date: Date; content: string } => {
  const PostValidationSchema = z
    .object({
      lang: z.enum(AUTHORIZED_LANGUAGES),
      date: z.coerce.date(),
      slug: z.string().regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/, 'Kebab case format not respected'),
      title: z.string(),
      excerpt: z.string(),
      cover: z.string().optional(),
      authors: z.array(z.enum(options.authors)),
      categories: z.array(z.enum(CATEGORIES)),
      keywords: z
        .array(z.string())
        .max(10, 'Too many items 😡.')
        .superRefine((val, ctx) => {
          if (intersection(val, CATEGORIES).length) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Must not include a category.',
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

  const { content, ...data } = getDataInMarkdownFile<z.infer<typeof PostValidationSchema>>({
    markdownFilePath: options.markdownFilePath,
    ValidationSchema: PostValidationSchema,
  });

  return {
    ...data,
    content: validateMarkdownContent({
      markdownFilePath: options.markdownFilePath,
      content,
    }),
  };
};

export const validateMarkdown = (): boolean => {
  const authorMarkdownFilePaths = globSync(`${AUTHORS_DIR}/**/*.md`);
  const postMarkdownFilePaths = globSync(`${POSTS_DIR}/**/*.md`);

  const authors: string[] = [];

  for (const markdownFilePath of authorMarkdownFilePaths) {
    const author = validateAuthor({ markdownFilePath });
    if (authors.includes(author.username)) {
      throw new MarkdownInvalidError({
        markdownFilePath,
        reason: 'This author already exists with the same username !',
      });
    }
    authors.push(author.username);
  }

  const postIds: string[] = [];

  for (const markdownFilePath of postMarkdownFilePaths) {
    const post = validatePost({ authors: authors as [string, ...string[]], markdownFilePath });
    const postId = `${post.lang}-${post.slug}`;
    if (postIds.includes(postId)) {
      throw new MarkdownInvalidError({
        markdownFilePath,
        reason: 'This article already exists with the same slug and the same language !',
      });
    }
    postIds.push(postId);
  }

  return true;
};
