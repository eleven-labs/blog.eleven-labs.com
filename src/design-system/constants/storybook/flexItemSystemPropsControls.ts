import type { FlexItemSystemProps } from '@/design-system/types/SystemProps';

import { flexCssPropertyNameList, flexItemSystemProps, flexWrapCssPropertyNameList } from '@/design-system/constants';
import { createControls } from '@/design-system/helpers/storybookHelper';

export const flexItemSystemPropsControls = createControls<FlexItemSystemProps>({
  category: 'Flex Item System Props',
  props: flexItemSystemProps,
  options: {
    flexBasis: flexWrapCssPropertyNameList,
    flex: flexCssPropertyNameList,
  },
});
