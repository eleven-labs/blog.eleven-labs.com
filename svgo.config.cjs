module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
        },
      },
    },
    // this deletes width/height and adds it to the viewBox
    'removeDimensions',
    'prefixIds'
  ],
};
