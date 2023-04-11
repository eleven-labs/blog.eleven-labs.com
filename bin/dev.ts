import chokidar from 'chokidar';
import { cpSync } from 'node:fs';
import { resolve } from 'node:path';
import { createServer as createViteServer } from 'vite';

const rootDir = process.cwd();

const dev = async (): Promise<void> => {
  const vite = await createViteServer({
    base: process.env.BASE_URL || '/',
    appType: 'custom',
    server: {
      host: '0.0.0.0',
    },
  });

  const assetsDir = resolve(rootDir, '_assets');
  const watcher = chokidar.watch(assetsDir, { cwd: assetsDir });

  watcher.on('all', (event, filePath) => {
    cpSync(resolve(assetsDir, filePath), resolve(rootDir, 'public/imgs', filePath), { recursive: true });
  });

  await vite.ssrLoadModule('/src/server.ts');
};

dev();
