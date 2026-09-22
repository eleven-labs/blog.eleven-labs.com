import react from '@vitejs/plugin-react';
import * as path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode, ssrBuild }) => ({
  plugins: [
    react(),
    tsconfigPaths(),
    visualizer({ filename: `reports/bundle-${ssrBuild ? 'ssr' : 'client'}-${mode}-stats.html`, gzipSize: true }),
  ],
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
  ssr: {
    // react-syntax-highlighter publie de l'ESM dont les imports n'ont pas d'extension : Node ne sait
    // pas les résoudre, il faut donc l'embarquer dans le bundle plutôt que l'externaliser.
    noExternal: ['react-syntax-highlighter'],
  },
  build: {
    rollupOptions: {
      input: './src/entry-client.tsx',
    },
  },
}));
