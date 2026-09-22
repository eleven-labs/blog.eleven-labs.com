import type { FlexSystemProps } from '@/design-system/types/SystemProps';

import { flexDirectionCssPropertyNameList, flexSystemProps, flexWrapCssPropertyNameList } from '@/design-system/constants';
import { createControls } from '@/design-system/helpers/storybookHelper';

export const flexSystemPropsControls = createControls<FlexSystemProps>({
  category: 'Flex System Props',
  props: flexSystemProps,
  options: {
    flexDirection: flexDirectionCssPropertyNameList,
    flexWrap: flexWrapCssPropertyNameList,
  },
});
