import { cpSync } from 'node:fs';
import { resolve } from 'node:path';
import { build as buildVite } from 'vite';

import { ASSETS_DIR, OUT_DIR, OUT_PUBLIC_DIR } from '@/app-paths';
import { writeJsonDataFiles } from '@/helpers/contentHelper';

const BASE_URL = process.env.BASE_URL || '/';
const MODE = process.env.NODE_ENV || 'production';

const args = process.argv.slice(2).reduce<Record<string, string | number | boolean>>((currentArgs, currentArg) => {
  const [key, value] = currentArg.replace('--', '').split('=');
  currentArgs[key] = value;
  return currentArgs;
}, {});

const build = async (): Promise<void> => {
  cpSync(ASSETS_DIR, resolve(OUT_PUBLIC_DIR, 'imgs'), { recursive: true });
  await writeJsonDataFiles();

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
