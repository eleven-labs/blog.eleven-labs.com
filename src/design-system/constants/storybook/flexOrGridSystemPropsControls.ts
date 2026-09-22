import type { FlexOrGridSystemProps } from '@/design-system/types/SystemProps';

import {
  alignContentCssPropertyNameList,
  alignItemsCssPropertyNameList,
  flexOrGridSystemProps,
  justifyContentCssPropertyNameList,
  spacingTokenNameList,
} from '@/design-system/constants';
import { createControls } from '@/design-system/helpers/storybookHelper';

export const flexOrGridSystemPropsControls = createControls<FlexOrGridSystemProps>({
  category: 'Flex Or Grid System Props',
  props: flexOrGridSystemProps,
  options: {
    alignContent: alignContentCssPropertyNameList,
    alignItems: alignItemsCssPropertyNameList,
    gap: spacingTokenNameList,
    gapX: spacingTokenNameList,
    gapY: spacingTokenNameList,
    justifyContent: justifyContentCssPropertyNameList,
  },
});
