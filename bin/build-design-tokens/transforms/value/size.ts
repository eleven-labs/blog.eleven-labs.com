import StyleDictionary from 'style-dictionary';

StyleDictionary.registerTransform({
  name: 'size/px',
  type: 'value',
  transitive: true,
  matcher: token => token?.type !== 'scale' && ['spacing', 'font-size'].some(name => token.path.includes(name)),
  transformer: token => `${parseInt(token.value)}px`,
});
