import { omitSystemProps } from '@/design-system/helpers/systemPropsHelper';

describe('Test method omitSystemProps', () => {
  test.each([
    {
      parameters: {
        props: {
          m: 'xxs',
          name: 'john',
          disabled: true,
        },
        systemPropNames: ['m'],
      },
      expected: {
        name: 'john',
        disabled: true,
      },
    },
  ])('omit system props $expected', ({ parameters, expected }) => {
    expect(omitSystemProps(parameters)).toEqual(expected);
  });
});
