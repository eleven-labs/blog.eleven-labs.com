import { build as buildVite } from 'vite';

const build = async (): Promise<void> => {
  // 1. Build Server
  buildVite({
    base: process.env.BASE_URL || '/',
    build: {
      emptyOutDir: false,
      ssr: true,
      outDir: 'dist',
      rollupOptions: {
        input: 'src/server.ts',
      },
    },
    mode: process.env.NODE_ENV || 'production',
  });

  // 2. Build Client
  buildVite({
    base: process.env.BASE_URL || '/',
    build: {
      emptyOutDir: false,
      manifest: true,
      outDir: 'dist/public',
    },
    mode: process.env.NODE_ENV || 'production',
  });
};

build();
