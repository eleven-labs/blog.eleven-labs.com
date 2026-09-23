import enTranslations from './en.translations.json';
import frTranslations from './fr.translations.json';

const getKeys = (translations: object, prefix = ''): string[] =>
  Object.entries(translations).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value !== null && typeof value === 'object' ? getKeys(value, path) : [path];
  });

describe('translations', () => {
  it('should expose the same keys in fr and en', () => {
    expect(getKeys(enTranslations).sort()).toEqual(getKeys(frTranslations).sort());
  });
});
