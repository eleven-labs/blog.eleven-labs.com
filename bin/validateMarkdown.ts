import type { MarkdownInvalidError } from '@/helpers/markdownHelper';

import { randomUUID } from 'node:crypto';
import { appendFileSync } from 'node:fs';

import { validateMarkdown } from '@/helpers/markdownHelper';

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
})();
