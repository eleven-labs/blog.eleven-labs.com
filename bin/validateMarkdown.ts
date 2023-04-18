import { createServer as createViteServer } from 'vite';

(async (): Promise<void> => {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const { validateMarkdown } = await vite.ssrLoadModule('/src/helpers/validateMarkdownHelper.ts');
    validateMarkdown();
  } catch (e) {
    console.error(e);
  } finally {
    vite.close();
  }
})();
