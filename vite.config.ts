import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import markdownPlugin from './plugins/markdown';

// https://vitejs.dev/config/
export default defineConfig(({ mode, ssrBuild }) => ({
  plugins: [
    react(),
    tsconfigPaths(),
    markdownPlugin(),
    visualizer({ filename: `reports/bundle-${ssrBuild ? 'ssr' : 'client'}-${mode}-stats.html`, gzipSize: true }),
  ],
  build: {
    rollupOptions: {
      input: './src/entry-client.tsx',
    },
  },
}));
