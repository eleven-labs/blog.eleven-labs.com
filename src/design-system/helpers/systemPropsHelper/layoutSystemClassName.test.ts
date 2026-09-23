import type { LayoutSystemProps } from '@/design-system/types/SystemProps';

import { layoutSystemClassName } from '@/design-system/helpers/systemPropsHelper';

describe('Test method ', () => {
  test.each([
    {
      props: {
        hiddenBelow: 'md',
      },
      expected: 'hidden-below@md',
    },
  ] as { props: LayoutSystemProps; expected: string }[])(
    'return layout class name $expected',
    ({ props, expected }) => {
      expect(layoutSystemClassName(props)).toEqual(expected);
    }
  );
});
