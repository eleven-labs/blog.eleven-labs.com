import type { ColorSystemProps } from '@/design-system/types';

import { colorTokenNameList } from '@/design-system/constants';
import { colorSystemProps } from '@/design-system/constants/systemProps';
import { createControls } from '@/design-system/helpers/storybookHelper';

export const colorSystemPropsControls = createControls<ColorSystemProps>({
  category: 'Color System Props',
  props: colorSystemProps,
  options: {
    bg: colorTokenNameList,
    color: colorTokenNameList,
  },
});
