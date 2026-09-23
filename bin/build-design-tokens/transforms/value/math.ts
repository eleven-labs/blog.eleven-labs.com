import StyleDictionary from 'style-dictionary';

StyleDictionary.registerTransform({
  name: 'math',
  type: 'value',
  transitive: true,
  matcher: token => typeof token.value === 'string' && /(\+|-|\*|\/)(\s|\d)/.test(token.value),
  transformer: token => {
    const cleanExpression = token.value.replace(/[a-z]+/gi, '');
    return eval(cleanExpression);
  },
});
