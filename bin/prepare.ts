import fs from 'node:fs';
import { resolve } from 'node:path';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';

const rootDir = process.cwd();

const copyImgs = (): void => {
  const srcDir = path.resolve(rootDir, '_assets');
  const outputDir = path.resolve(rootDir, 'public/imgs');
  fs.cpSync(srcDir, outputDir, { recursive: true });
};

const generateData = async (): Promise<void> => {
  const baseUrl = process.env.BASE_URL || '/';
  const rootDir = resolve(process.cwd(), 'public', 'data');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    base: baseUrl,
    appType: 'custom',
  });

  try {
    const { generateDataFiles } = await vite.ssrLoadModule('/src/helpers/dataHelper.ts');
    generateDataFiles({ rootDir });
  } catch (e) {
    console.error(e);
  } finally {
    vite.close();
  }
};

const prepare = (): void => {
  copyImgs();
  generateData();
};

prepare();
