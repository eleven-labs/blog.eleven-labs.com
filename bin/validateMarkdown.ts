import { MarkdownInvalidError, validateMarkdown } from '@/helpers/markdownHelper';

import { getArgs } from './binHelper';

(async (): Promise<void> => {
  const args = getArgs<{ ci: boolean }>();
  try {
    validateMarkdown();
  } catch (e) {
    const markdownInvalidError = e as MarkdownInvalidError;
    if (args.ci) {
      console.log(`::set-output name=filePath::${markdownInvalidError.markdownFilePathRelative}`);
      console.log(`::set-output name=reason::${markdownInvalidError.reason}`);
      if (markdownInvalidError.line && markdownInvalidError.column) {
        console.log(`::set-output name=line::${markdownInvalidError.line}`);
        console.log(`::set-output name=column::${markdownInvalidError.column}`);
      }
      process.exit(1);
    }

    console.error(markdownInvalidError);
  }
})();
