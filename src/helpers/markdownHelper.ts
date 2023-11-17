import { globSync } from 'glob';
import matter from 'gray-matter';
import { YAMLException } from 'js-yaml';
import { existsSync, readFileSync } from 'node:fs';
import * as path from 'path';
import { SomeZodObject, z, ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

import { ARTICLES_DIR, ASSETS_DIR, AUTHORS_DIR, TUTORIALS_DIR } from '@/app-paths';
import {
  ArticleDataSchemaValidation,
  AuthorDataValidationSchema,
  PostDataSchemaValidation,
  TutorialDataSchemaValidation,
  TutorialStepDataValidationSchema,
} from '@/config/schemaValidation';
import { capitalize } from '@/helpers/stringHelper';
import { ArticleData, AuthorData, CommonPostData, TutorialData, TutorialStepData } from '@/types';

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

export const getDataInMarkdownFile = <TData = { [p: string]: unknown }>(options: {
  markdownFilePath: string;
  validationSchema: ZodSchema;
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

    const result = options.validationSchema.safeParse(frontmatterResult.data);

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

  const assetRegex = new RegExp('{BASE_URL}\\/imgs\\/[^.]+\\.(jpg|jpeg|png|webp|svg)', 'g');
  const assetMatches = options.content.match(assetRegex);
  if (assetMatches) {
    for (const assetMatch of assetMatches) {
      const assetPath = assetMatch.replace(new RegExp('{BASE_URL}\\/imgs/'), `${ASSETS_DIR}/`).split('?')?.[0];

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

export const validateContentType = <TData>(options: {
  markdownFilePath: string;
  validationSchema: SomeZodObject;
  authors?: [string, ...string[]];
}): TData & { content: string } => {
  let validationSchema = options.validationSchema;
  if (options.authors) {
    validationSchema = validationSchema.merge(
      z.object({
        authors: z.array(z.enum(options.authors)),
      })
    );
  }

  const { content, ...data } = getDataInMarkdownFile<z.infer<typeof options.validationSchema>>({
    markdownFilePath: options.markdownFilePath,
    validationSchema: validationSchema,
  });

  if (data.cover) {
    const assetPath = data.cover.replace(new RegExp('/imgs/'), `${ASSETS_DIR}/`).split('?')?.[0];
    if (!existsSync(assetPath)) {
      throw new MarkdownInvalidError({
        markdownFilePath: options.markdownFilePath,
        reason: `The file does not exist "${assetPath}"!`,
      });
    }
  }

  return {
    ...(data as TData),
    content: validateMarkdownContent({
      markdownFilePath: options.markdownFilePath,
      content,
    }),
  };
};

export const validateAuthor = (options: {
  markdownFilePath: string;
}): ReturnType<typeof validateContentType<AuthorData>> =>
  validateContentType<AuthorData>({
    markdownFilePath: options.markdownFilePath,
    validationSchema: AuthorDataValidationSchema,
  });

export const validatePost = (options: {
  markdownFilePath: string;
  authors: string[];
}): ReturnType<typeof validateContentType<CommonPostData>> =>
  validateContentType<CommonPostData>({
    markdownFilePath: options.markdownFilePath,
    validationSchema: PostDataSchemaValidation,
    authors: options.authors as [string, ...string[]],
  });

export const validateArticle = (options: {
  markdownFilePath: string;
  authors: string[];
}): ReturnType<typeof validateContentType<ArticleData>> =>
  validateContentType<ArticleData>({
    markdownFilePath: options.markdownFilePath,
    validationSchema: ArticleDataSchemaValidation,
    authors: options.authors as [string, ...string[]],
  });

export const validateTutorial = (options: {
  markdownFilePath: string;
  authors: string[];
}): ReturnType<typeof validateContentType<TutorialData>> =>
  validateContentType<TutorialData>({
    markdownFilePath: options.markdownFilePath,
    validationSchema: TutorialDataSchemaValidation,
    authors: options.authors as [string, ...string[]],
  });

export const validateTutorialStep = (options: {
  markdownFilePath: string;
}): ReturnType<typeof validateContentType<TutorialStepData>> =>
  validateContentType<TutorialStepData>({
    markdownFilePath: options.markdownFilePath,
    validationSchema: TutorialStepDataValidationSchema,
  });

export const validateMarkdown = (): boolean => {
  const authorMarkdownFilePaths = globSync(`${AUTHORS_DIR}/**/*.md`);
  const articleMarkdownFilePaths = globSync(`${ARTICLES_DIR}/**/*.md`);
  const tutorialMarkdownFilePaths = globSync(`${TUTORIALS_DIR}/**/index.md`);

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

  for (const markdownFilePath of articleMarkdownFilePaths) {
    const article = validateArticle({
      markdownFilePath,
      authors,
    });
    const articleId = `${article.lang}-${article.slug}`;
    if (postIds.includes(articleId)) {
      throw new MarkdownInvalidError({
        markdownFilePath,
        reason: 'This article already exists with the same slug and the same language !',
      });
    }
    postIds.push(articleId);
  }

  for (const markdownFilePath of tutorialMarkdownFilePaths) {
    const tutorial = validateTutorial({
      markdownFilePath,
      authors: authors as [string, ...string[]],
    });
    const tutorialStepsMarkdownFilePaths = globSync(path.resolve(path.dirname(markdownFilePath), 'steps', '**.md'));
    for (const tutorialStepMarkdownFilePath of tutorialStepsMarkdownFilePaths) {
      validateTutorialStep({
        markdownFilePath: tutorialStepMarkdownFilePath,
      });
    }
    const tutorialId = `${tutorial.lang}-${tutorial.slug}`;
    if (postIds.includes(tutorialId)) {
      throw new MarkdownInvalidError({
        markdownFilePath,
        reason: 'This tutorial already exists with the same slug and the same language !',
      });
    }
    postIds.push(tutorialId);
  }

  return true;
};
