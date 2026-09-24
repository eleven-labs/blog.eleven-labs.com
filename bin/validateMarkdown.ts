import type { MarkdownInvalidError } from '@/helpers/markdownHelper';

import { randomUUID } from 'node:crypto';
import { appendFileSync } from 'node:fs';

import { findHtmlElements, findImagesWithoutAlt, validateMarkdown } from '@/helpers/markdownHelper';

const IS_CI = Boolean(process.env.CI);

const setGithubOutput = (name: string, value: string): void => {
  const githubOutputFilePath = process.env.GITHUB_OUTPUT;
  if (!githubOutputFilePath) {
    return;
  }
  // Heredoc format required by GitHub Actions for multiline-safe values.
  const delimiter = randomUUID();
  appendFileSync(githubOutputFilePath, `${name}<<${delimiter}\n${value}\n${delimiter}\n`);
};

((): void => {
  try {
    validateMarkdown();
  } catch (e) {
    const markdownInvalidError = e as MarkdownInvalidError;

    console.error(markdownInvalidError.message);

    if (IS_CI) {
      setGithubOutput('filePath', markdownInvalidError.markdownFilePathRelative);
      setGithubOutput('reason', markdownInvalidError.reason);
      if (markdownInvalidError.line && markdownInvalidError.column) {
        setGithubOutput('line', String(markdownInvalidError.line));
        setGithubOutput('column', String(markdownInvalidError.column));
      }

      const location = markdownInvalidError.line
        ? `,line=${markdownInvalidError.line}${markdownInvalidError.column ? `,col=${markdownInvalidError.column}` : ''}`
        : '';
      console.error(
        `::error file=${markdownInvalidError.markdownFilePathRelative}${location}::${markdownInvalidError.reason}`
      );

      process.exit(1);
    }
  }

  const warn = (markdownFilePathRelative: string, line: number, message: string): void =>
    console.warn(
      IS_CI
        ? `::warning file=${markdownFilePathRelative},line=${line}::${message}`
        : `${markdownFilePathRelative}:${line} ${message}`
    );

  // Only a warning: the older contents still have images without alternative text, fixing them is an editorial work
  const imagesWithoutAlt = findImagesWithoutAlt();
  for (const { markdownFilePathRelative, image, line } of imagesWithoutAlt) {
    warn(
      markdownFilePathRelative,
      line,
      `Image without alternative text, describe it between the brackets for Google Images: ${image}`
    );
  }
  if (imagesWithoutAlt.length) {
    console.warn(`${imagesWithoutAlt.length} images without alternative text`);
  }

  // Only a warning as well: the older contents still have HTML, rewriting it in markdown is an editorial work
  const htmlElements = findHtmlElements();
  for (const { markdownFilePathRelative, element, line } of htmlElements) {
    warn(
      markdownFilePathRelative,
      line,
      `HTML element ${element}, write it in markdown or with a component of src/helpers/mdxComponents.tsx`
    );
  }
  if (htmlElements.length) {
    console.warn(`${htmlElements.length} HTML elements`);
  }
})();
