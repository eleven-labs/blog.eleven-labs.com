import type { ColorSystemProps } from '@/design-system/types';

import { colorSystemClassName } from '@/design-system/helpers/systemPropsHelper';

describe('Test method colorSystemClassName', () => {
  test.each([
    {
      props: {
        bg: 'primary',
        color: 'white',
      },
      expected: 'bg-primary color-white',
    },
  ] as { props: ColorSystemProps; expected: string }[])('return color class name $expected', ({ props, expected }) => {
    expect(colorSystemClassName(props)).toStrictEqual(expected);
  });
});
