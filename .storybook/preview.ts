import '../src/styles.css';

const customViewports = {
  extraSmallScreen: {
    name: 'Extra small screen (xs)',
    styles: {
      width: '380px',
      height: '571px',
    },
    type: 'Mobile',
  },
  smallScreen: {
    name: 'Small screen (sm)',
    styles: {
      width: '571px',
      height: '766px',
    },
    type: 'Tablet',
  },
  mediumScreen: {
    name: 'Medium screen (md)',
    styles: {
      width: '1001px',
      height: '766px',
    },
    type: 'Desktop',
  },
};

// Reprend la palette de `src/design-system/styles/theme.css`.
const backgroundColors = {
  primary: '#0a4084',
  'primary-dark': '#194180',
  'primary-very-dark': '#093670',
  secondary: '#e9f1f8',
  'secondary-dark': '#c5d3e9',
  info: '#dd3156',
  accent: '#f8fa9b',
  'ultra-light-grey': '#ededed',
  'light-grey': '#c4c4c4',
  grey: '#9b9b9b',
  'dark-grey': '#757575',
  'ultra-dark-grey': '#333',
  black: '#000',
  white: '#fff',
};

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
    exclude: ['as'],
  },
  viewport: {
    viewports: customViewports,
  },
  backgrounds: {
    default: 'secondary',
    values: Object.entries(backgroundColors).map(([name, value]) => ({ name, value })),
  },
};
