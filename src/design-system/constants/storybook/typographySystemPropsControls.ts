import type { TypographySystemProps } from '@/design-system/types';

import { textAlignCssPropertyNameList, typographySystemProps } from '@/design-system/constants';
import { createControls } from '@/design-system/helpers/storybookHelper';

export const typographySystemPropsControls = createControls<TypographySystemProps>({
  category: 'Typography System Props',
  props: typographySystemProps,
  options: {
    textAlign: textAlignCssPropertyNameList,
  },
  controlType: {
    italic: 'boolean',
    underline: 'boolean',
  },
});
