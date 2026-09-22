import { classNameWithModifier } from '@/design-system/helpers/systemPropsHelper';

describe('Test method classNameWithModifier', () => {
  test.each([
    {
      options: {
        className: 'text',
        defaultModifier: 'xs',
        propValue: 'center',
      },
      expected: 'text-center@xs',
    },
    {
      options: {
        className: 'color',
        defaultModifier: 'dark',
        propValue: 'ultramarine-light',
      },
      expected: 'color-ultramarine-light@dark',
    },
    {
      options: {
        className: 'italic',
        defaultModifier: 'xs',
        propValue: true,
      },
      expected: 'italic@xs',
    },
  ])('return class name with modifier $expected', ({ options, expected }) => {
    expect(classNameWithModifier<string | number | boolean>(options)).toEqual(expected);
  });
});
