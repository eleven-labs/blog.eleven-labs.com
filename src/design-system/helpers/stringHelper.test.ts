import { kebabCase } from '@/design-system/helpers/stringHelper';

describe('Test string helpers', () => {
  test('return string to kebab case', () => {
    expect(kebabCase('textAlign')).toEqual('text-align');
  });
});
