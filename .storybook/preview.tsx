import type { Preview } from '@storybook/react-vite';

import '../src/styles.css';

/** Points de rupture du blog (`--breakpoint-*` des tokens), pour la barre d'outils. */
const viewports = {
  mobile: { name: 'Mobile (xs)', styles: { width: '380px', height: '760px' }, type: 'mobile' },
  tablet: { name: 'Tablette (sm)', styles: { width: '571px', height: '800px' }, type: 'tablet' },
  desktop: { name: 'Bureau (md)', styles: { width: '1001px', height: '800px' }, type: 'desktop' },
};

const preview: Preview = {
  // Onglet Docs pour toutes les histoires, sans le répéter dans chaque fichier.
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    viewport: { options: viewports },
    // Une violation d'accessibilité fait échouer le test de l'histoire (vitest, CI). Pendant la migration, les histoires
    // des blocs pas encore migrés sont en 'todo' dans leur meta.
    a11y: { test: 'error' },
    options: {
      // Sections dans l'ordre des rôles, UI par catégories, puis titres par ordre alphabétique ; les histoires d'un
      // fichier gardent leur ordre.
      storySort: {
        method: 'alphabetical',
        order: [
          'Design system',
          ['Introduction', 'Tokens', 'Classes'],
          'UI',
          ['Actions', 'Forms', 'Overlays', 'Navigation', 'Display', 'Feedback'],
          'Shared',
          'Layouts',
          'Features',
          'Pages',
        ],
      },
    },
  },
};

export default preview;
