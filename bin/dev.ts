import { createServer as createViteServer } from 'vite';

const dev = async (): Promise<void> => {
  const vite = await createViteServer({
    base: process.env.BASE_URL || '/',
    appType: 'custom',
  });
  await vite.ssrLoadModule('/src/server.ts');
};

dev();
