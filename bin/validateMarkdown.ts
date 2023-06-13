import { createServer as createViteServer } from 'vite';

(async (): Promise<void> => {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const { validateMarkdown } = await vite.ssrLoadModule('/src/helpers/validateMarkdownHelper.ts');
    validateMarkdown();
    vite.close();
  } catch (e) {
    console.log(`::set-output name=result::${String(e)}`)
    vite.close();
    process.exit(1);
  }
})();
