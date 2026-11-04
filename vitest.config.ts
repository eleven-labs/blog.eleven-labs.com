import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { fileURLToPath } from 'node:url';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const configDir = fileURLToPath(new URL('./.storybook', import.meta.url));

// Deux projets : les tests unitaires (jsdom), et chaque histoire de Storybook rendue dans Chromium, accessibilité comprise.
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          globals: true,
          environment: 'jsdom',
          setupFiles: ['./src/setup-test.ts'],
          include: ['**/*.test.cjs', '**/*.test.ts', '**/*.test.tsx'],
          exclude: ['node_modules/**', 'dist/**'],
        },
      },
      {
        extends: true,
        plugins: [tailwindcss(), storybookTest({ configDir })],
        test: {
          name: 'stories',
          browser: { enabled: true, headless: true, provider: playwright(), instances: [{ browser: 'chromium' }] },
        },
      },
    ],
  },
});
