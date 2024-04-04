import { cpSync } from 'node:fs';
import { resolve } from 'node:path';
import { build as buildVite } from 'vite';
import { createServer as createViteServer } from 'vite';

import { generateImageFormats } from '../src/helpers/generateImageFormats';

const BASE_URL = process.env.BASE_URL || '/';
const MODE = process.env.NODE_ENV || 'production';
const WITH_GENERATE_IMAGE_FORMATS = process.env.WITH_GENERATE_IMAGE_FORMATS !== 'false';
const ROOT_DIR = process.cwd();
const ASSETS_DIR = resolve(ROOT_DIR, '_assets');
const OUT_DIR = resolve(ROOT_DIR, 'dist');
const PUBLIC_DIR = resolve(ROOT_DIR, 'public');
const OUT_PUBLIC_DIR = resolve(OUT_DIR, 'public');

const args = process.argv.slice(2).reduce<Record<string, string | number | boolean>>((currentArgs, currentArg) => {
  const [key, value] = currentArg.replace('--', '').split('=');
  currentArgs[key] = value;
  return currentArgs;
}, {});

const writeJsonDataFilesAndFeedFile = async (): Promise<void> => {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    base: BASE_URL,
    appType: 'custom',
  });

  try {
    const { writeJsonDataFiles } = await vite.ssrLoadModule('/src/helpers/contentHelper.ts');
    writeJsonDataFiles();
  } catch (e) {
    console.error(e);
  } finally {
    vite.close();
  }
};

const build = async (): Promise<void> => {
  const designSystemRootDir = resolve(process.cwd(), 'node_modules/@eleven-labs/design-system/dist');
  cpSync(ASSETS_DIR, resolve(PUBLIC_DIR, 'imgs'), { recursive: true });
  cpSync(resolve(designSystemRootDir, 'imgs'), resolve(PUBLIC_DIR, 'imgs'), { recursive: true });
  await writeJsonDataFilesAndFeedFile();
  if (WITH_GENERATE_IMAGE_FORMATS) {
    await generateImageFormats();
  }

  if (args.ssr) {
    await buildVite({
      base: BASE_URL,
      build: {
        emptyOutDir: false,
        ssr: true,
        outDir: OUT_DIR,
        rollupOptions: {
          input: 'src/server.ts',
        },
      },
      mode: MODE,
    });
  }

  await buildVite({
    base: BASE_URL,
    build: {
      emptyOutDir: false,
      manifest: true,
      outDir: OUT_PUBLIC_DIR,
    },
    mode: MODE,
  });
};

build();
