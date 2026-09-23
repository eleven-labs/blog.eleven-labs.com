import StyleDictionary from 'style-dictionary';

StyleDictionary.registerTransform({
  type: 'name',
  name: 'name/cti/kebab-only-category-item',
  matcher: (token) => token?.attributes?.category === 'color',
  transformer: (token) =>
    token?.attributes?.category && token?.attributes?.item
      ? `${token?.attributes?.category}-${token?.attributes?.item}`
      : token.name,
});
