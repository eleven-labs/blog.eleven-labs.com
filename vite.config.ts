import replace from '@rollup/plugin-replace';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode, ssrBuild }) => ({
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(mode),
    }),
    mode === 'production'
      ? react({
          jsxRuntime: 'classic',
        })
      : react(),
    tsconfigPaths(),
    visualizer({ filename: `reports/bundle-${ssrBuild ? 'ssr' : 'client'}-${mode}-stats.html`, gzipSize: true }),
  ],
  build: {
    rollupOptions: {
      input: './src/entry-client.tsx',
    },
  },
}));
