import type { SystemProps } from '@/design-system/types';

import { systemClassName } from '@/design-system/helpers/systemPropsHelper';

describe('Test method systemClassName', () => {
  test.each([
    {
      props: {
        display: 'flex',
        width: 'full',
        color: 'primary',
        p: {
          xs: 's',
          md: 'm',
        },
        m: 'm',
      },
      expected:
        'color-primary display-flex@xs width-full@xs p-s@xs p-m@md m-m@xs',
    },
  ] as { props: SystemProps; expected: string }[])('return system class name $expected', ({ props, expected }) => {
    expect(systemClassName(props)).toEqual(expected);
  });
});
