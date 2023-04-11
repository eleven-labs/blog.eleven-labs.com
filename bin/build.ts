import { cpSync } from 'node:fs';
import { resolve } from 'node:path';
import { build as buildVite } from 'vite';
import { createServer as createViteServer } from 'vite';

const rootDir = process.cwd();
const outDir = resolve(rootDir, 'dist');
const outPublicDir = resolve(rootDir, 'dist/public');
const args = process.argv.slice(2).reduce<Record<string, string | number | boolean>>((currentArgs, currentArg) => {
  const [key, value] = currentArg.replace('--', '').split('=');
  currentArgs[key] = value;
  return currentArgs;
}, {});

const copyImgs = (): void => {
  const srcDir = resolve(rootDir, '_assets');
  const outputDir = resolve(rootDir, 'public/imgs');
  cpSync(srcDir, outputDir, { recursive: true });
};

const generateFeeds = async (): Promise<void> => {
  const baseUrl = process.env.BASE_URL || '/';

  const vite = await createViteServer({
    server: { middlewareMode: true },
    base: baseUrl,
    appType: 'custom',
  });

  try {
    const { generateFeedFile } = await vite.ssrLoadModule('/src/helpers/feedHelper.ts');
    generateFeedFile({ rootDir: outPublicDir });
  } catch (e) {
    console.error(e);
  } finally {
    vite.close();
  }
};

const build = async (): Promise<void> => {
  copyImgs();
  if (args.ssr) {
    await buildVite({
      base: process.env.BASE_URL || '/',
      build: {
        emptyOutDir: false,
        ssr: true,
        outDir: outDir,
        rollupOptions: {
          input: 'src/server.ts',
        },
      },
      mode: process.env.NODE_ENV || 'production',
    });
  }

  await buildVite({
    base: process.env.BASE_URL || '/',
    build: {
      emptyOutDir: false,
      manifest: true,
      outDir: outPublicDir,
    },
    mode: process.env.NODE_ENV || 'production',
  });

  generateFeeds();
};

build();
