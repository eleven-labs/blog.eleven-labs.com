import '@eleven-labs/design-system/style.css';

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
      width: `571px`,
      height: '766px',
    },
    type: 'Tablet',
  },
  mediumScreen: {
    name: 'Medium screen (md)',
    styles: {
      width: `1001px`,
      height: '766px',
    },
    type: 'Desktop',
  },
};


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    viewports: customViewports,
  },
  backgrounds: {
    default: 'content',
    values: [
      {
        name: 'content',
        value: '#E9F1F8',
      },
      {
        name: 'white',
        value: '#FFF'
      },
      {
        name: 'ultra-light-grey',
        value: '#EDEDED'
      },

    ],
  },
}
