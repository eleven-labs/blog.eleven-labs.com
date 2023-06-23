import { createServer as createViteServer } from 'vite';

import { MarkdownInvalidError } from '../src/helpers/markdownHelper';
import { getArgs } from './binHelper';

(async (): Promise<void> => {
  const args = getArgs<{ ci: boolean }>();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const { validateMarkdown } = await vite.ssrLoadModule('/src/helpers/markdownHelper.ts');
    validateMarkdown();
    vite.close();
  } catch (e) {
    vite.close();

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
