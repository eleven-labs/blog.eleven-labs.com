import { readFileSync } from 'node:fs';
import remarkFrontmatter from 'remark-frontmatter';
import remarkParse from 'remark-parse';
import remarkParseFrontmatter from 'remark-parse-frontmatter';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

export const frontmatter = <TData = { [p: string]: unknown }>(content: string): { data: TData; content: string } => {
  const vfile = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkParseFrontmatter)
    .use(remarkStringify)
    .processSync(content);

  return {
    data: vfile.data.frontmatter as TData,
    content: content.replace(/-{3}\n([\s\S]*?)\n-{3}\n{0,2}/, ''),
  };
};

export const getDataInMarkdownFile = <TData = { [p: string]: unknown }>(options: {
  markdownFilePath: string;
  ValidationSchema: ZodSchema;
}): TData & { content: string } => {
  const markdownContent = readFileSync(options.markdownFilePath, { encoding: 'utf-8' });

  if (markdownContent.match(/{:[^}]+}/)) {
    throw new Error(
      `The markdown of the file "${options.markdownFilePath}" is not compliant, it contains a syntax that is not allowed !`
    );
  }

  try {
    const frontmatterResult = frontmatter(markdownContent);

    const result = options.ValidationSchema.safeParse(frontmatterResult.data);

    if (!result.success) {
      const validationError = fromZodError(result.error);
      throw new Error(`The markdown of the file "${options.markdownFilePath}" is invalid ! ${validationError.message}`);
    }

    return { ...result.data, content: frontmatterResult.content };
  } catch (error) {
    throw new Error(`The markdown of the file "${options.markdownFilePath}" is invalid ! ${String(error)}`);
  }
};
