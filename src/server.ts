import chokidar from 'chokidar';
import express from 'express';
import { statSync } from 'fs';
import i18next from 'i18next';
import i18nextHttpMiddleware from 'i18next-http-middleware';
import { cpSync } from 'node:fs';
import { resolve } from 'node:path';
import cookiesMiddleware from 'universal-cookie-express';

import { ARTICLES_DIR, ASSETS_DIR, AUTHORS_DIR, IMGS_DIR } from '@/app-paths';
import { i18nConfig } from '@/config/i18n/i18n.config';
import { i18nResources } from '@/config/i18n/i18nResources';
import { BASE_URL } from '@/constants';
import { writeJsonDataFiles } from '@/helpers/contentHelper';
import { loadDataByMarkdownFilePath } from '@/helpers/markdownContentManagerHelper';
import { getSitemap } from '@/helpers/prerenderHelper/generateSitemap';
import { getSitemapEntries } from '@/helpers/prerenderHelper/getSitemapEntries';
import { createRequestByExpressRequest } from '@/helpers/requestHelper';

const isProd: boolean = process.env.NODE_ENV === 'production';

const createServer = async (): Promise<void> => {
  i18next.use(i18nextHttpMiddleware.LanguageDetector).init({
    ...i18nConfig,
    resources: i18nResources,
  });

  const app = express();
  app.use(cookiesMiddleware()).use(i18nextHttpMiddleware.handle(i18next));

  if (isProd) {
    const { dirname, resolve } = await import('node:path');
    const { fileURLToPath } = await import('node:url');
    const { getHtmlTemplatePropsByManifest } = await import('./helpers/ssrHelper');
    const { default: serveStatic } = await import('serve-static');

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = resolve(dirname(__filename), 'public');
    const { links, scripts } = getHtmlTemplatePropsByManifest({
      baseUrl: BASE_URL,
      dirname: __dirname,
    });

    app.use(BASE_URL, serveStatic(__dirname, { index: false }));

    app.get('/sitemap.xml', (_, res) => {
      const sitemapEntries = getSitemapEntries();
      const sitemap = getSitemap(sitemapEntries);
      res.status(200).set({ 'Content-Type': 'text/xml' }).end(sitemap);
    });

    app.use('*', async (req, res, next) => {
      try {
        const { render } = await import('./entry-server.js');
        const request = createRequestByExpressRequest(req);
        const cookies = (req as unknown as { universalCookies: Record<string, string> }).universalCookies;
        const html = await render({
          request,
          cookies,
          i18n: req.i18n,
          links,
          scripts,
        });
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
      base: BASE_URL,
    });

    const assetsWatcher = chokidar.watch(ASSETS_DIR, { cwd: ASSETS_DIR });
    assetsWatcher.on('all', (event, filePath) => {
      cpSync(resolve(ASSETS_DIR, filePath), resolve(IMGS_DIR, filePath), { recursive: true });
    });

    writeJsonDataFiles();

    const markdownWatcher = chokidar.watch([ARTICLES_DIR, AUTHORS_DIR]);
    markdownWatcher.on('change', (filePath) => {
      if (statSync(filePath).isFile()) {
        loadDataByMarkdownFilePath({ filePath });
        writeJsonDataFiles();
      }
      vite.ws.send({
        type: 'custom',
        event: 'markdown-update',
      });
    });

    app.use(vite.middlewares);

    app.get('/sitemap.xml', (_, res) => {
      const sitemapEntries = getSitemapEntries();
      const sitemap = getSitemap(sitemapEntries);
      res.status(200).set({ 'Content-Type': 'text/xml' }).end(sitemap);
    });

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;

      try {
        const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');
        const request = createRequestByExpressRequest(req);
        const cookies = (req as unknown as { universalCookies: Record<string, string> }).universalCookies;
        const html = await render({
          request,
          cookies,
          i18n: req.i18n,
          scripts: [
            {
              type: 'module',
              src: '/src/entry-client.tsx',
            },
          ],
        });

        const htmlWithViteHMRClient = await vite.transformIndexHtml(url, html);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(htmlWithViteHMRClient);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  const PORT = process.env.PORT || 5173;
  app.listen(PORT, () => {
    console.log(`Your site is now being served at: http://localhost:${PORT}`);
  });
};

createServer();
