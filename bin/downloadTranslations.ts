import { createServer as createViteServer } from 'vite';

(async (): Promise<void> => {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const { downloadTranslations } = await vite.ssrLoadModule('/src/helpers/downloadTranslationsHelper.ts');
    downloadTranslations();
  } catch (e) {
    console.error(e);
  } finally {
    vite.close();
  }
})();
