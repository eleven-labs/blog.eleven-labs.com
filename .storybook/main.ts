import type { StorybookConfig } from '@storybook/react-vite';

import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

/** Documentation du design system : tokens, classes sémantiques, composants sans état et écrans. */
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-themes', '@storybook/addon-vitest'],
  framework: { name: '@storybook/react-vite', options: {} },
  core: { disableTelemetry: true },
  viteFinal: (viteConfig, { configType }) => ({
    ...viteConfig,
    // Storybook publié sous /design-system/ du blog
    base: configType === 'PRODUCTION' ? '/design-system/' : viteConfig.base,
    plugins: [...(viteConfig.plugins ?? []), tailwindcss()],
    resolve: {
      ...viteConfig.resolve,
      alias: [
        { find: '@/storybook', replacement: resolve(import.meta.dirname) },
        { find: '@', replacement: resolve(import.meta.dirname, '../src') },
      ],
    },
    // JSX sans import de React, même quand tsconfig.json est en "jsx": "react"
    esbuild: { ...viteConfig.esbuild, jsx: 'automatic' },
    // Runtime JSX optimisé d'emblée : découvert en cours de test, il recharge la page et fait échouer le premier
    // lancement des histoires (cache vide, toujours le cas en CI)
    optimizeDeps: {
      ...viteConfig.optimizeDeps,
      include: [...(viteConfig.optimizeDeps?.include ?? []), 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    },
    build: {
      ...viteConfig.build,
      rollupOptions: {
        ...viteConfig.build?.rollupOptions,
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE' || warning.code === 'SOURCEMAP_ERROR') return;
          warn(warning);
        },
      },
    },
  }),
};

export default config;
