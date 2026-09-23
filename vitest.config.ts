import react from '@vitejs/plugin-react';
import * as path from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // L'API JS historique de Dart Sass est dépréciée et disparaîtra avec Dart Sass 2.
        api: 'modern-compiler',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setup-test.ts'],
    include: ['**/*.test.cjs', '**/*.test.ts', '**/*.test.tsx'],
  },
});
