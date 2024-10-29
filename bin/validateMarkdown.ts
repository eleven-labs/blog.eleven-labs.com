import { MarkdownInvalidError, validateMarkdown } from '@/helpers/markdownHelper';

const IS_CI = Boolean(process.env.CI);

(async (): Promise<void> => {
  try {
    validateMarkdown();
  } catch (e) {
    const markdownInvalidError = e as MarkdownInvalidError;
    if (IS_CI) {
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
