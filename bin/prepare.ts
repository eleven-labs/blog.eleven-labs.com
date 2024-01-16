import { cpSync } from 'node:fs';
import { resolve } from 'node:path';
import { createServer as createViteServer } from 'vite';

(async (): Promise<void> => {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const { downloadTranslations } = await vite.ssrLoadModule('/src/helpers/downloadTranslationsHelper.ts');
    downloadTranslations();
    const designSystemRootDir = resolve(process.cwd(), 'node_modules/@eleven-labs/design-system/dist');
    const destDir = resolve(process.cwd(), 'public');
    cpSync(resolve(process.cwd(), 'src/assets/imgs'), resolve(destDir, 'imgs'), { recursive: true });
    cpSync(resolve(designSystemRootDir, 'imgs'), resolve(destDir, 'imgs'), { recursive: true });
  } catch (e) {
    console.error(e);
  } finally {
    vite.close();
  }
})();
