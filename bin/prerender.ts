import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createServer as createViteServer } from 'vite';

import { createRequestByUrl } from '../src/helpers/requestHelper';

const rootDir = process.cwd();

const prerender = async (): Promise<void> => {
  const baseUrl = process.env.BASE_URL || '/';
  const vite = await createViteServer({
    server: { middlewareMode: true },
    base: baseUrl,
    appType: 'custom',
    mode: 'prerender',
  });

  try {
    const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');
    const { getLinksAndScripts } = await vite.ssrLoadModule('/src/helpers/ssrHelper.ts');

    const { getI18nInstanceByLang, getUrlsByLang } = await vite.ssrLoadModule('/src/helpers/prerenderHelper.ts');
    const urlsByLang = getUrlsByLang({ baseUrl });
    const { links, scripts } = getLinksAndScripts({
      dirname: resolve(rootDir, 'dist'),
      baseUrl: process.env.BASE_URL,
    });

    for (const { lang, url } of urlsByLang) {
      const i18n = getI18nInstanceByLang(lang);
      const html = await render({
        request: createRequestByUrl({ url }),
        i18n,
        links,
        scripts,
      });

      const filePath = resolve(
        rootDir,
        'dist/public',
        `${url.length > 1 ? `${url.substring(1)}/` : ''}index.html`
      ).replace(baseUrl, '/');

      const dirPath = dirname(filePath);
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }
      writeFileSync(filePath, html, 'utf8');
    }

    console.log('🦖🖨 Your static site is ready to deploy from dist');
  } catch (e) {
    console.error(e);
  } finally {
    vite.close();
  }
};

prerender();
