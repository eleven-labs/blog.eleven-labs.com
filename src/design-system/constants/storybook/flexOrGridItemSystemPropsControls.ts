import type { FlexOrGridItemSystemProps } from '@/design-system/types/SystemProps';

import { alignSelfCssPropertyNameList, flexOrGridItemSystemProps } from '@/design-system/constants';
import { createControls } from '@/design-system/helpers/storybookHelper';

export const flexOrGridItemSystemPropsControls = createControls<FlexOrGridItemSystemProps>({
  category: 'Flex Or Grid Item System Props',
  props: flexOrGridItemSystemProps,
  options: {
    alignSelf: alignSelfCssPropertyNameList,
  },
});
