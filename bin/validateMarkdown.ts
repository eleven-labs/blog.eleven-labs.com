import { createServer as createViteServer } from 'vite';

(async (): Promise<void> => {
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
    console.log(`::set-output name=result::${String(e)}`);
    process.exit(1);
  }
})();
