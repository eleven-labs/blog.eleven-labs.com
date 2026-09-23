import type { LayoutSystemProps } from '@/design-system/types/SystemProps';

import {
  displayCssPropertyNameList,
  heightTokenNameList,
  layoutSystemProps,
  mediaQueriesList,
  widthTokenNameList,
} from '@/design-system/constants';
import { createControls } from '@/design-system/helpers/storybookHelper';

export const layoutSystemPropsControls = createControls<LayoutSystemProps>({
  category: 'Layout System Props',
  props: layoutSystemProps,
  options: {
    display: displayCssPropertyNameList,
    width: widthTokenNameList,
    height: heightTokenNameList,
    hiddenAbove: mediaQueriesList,
    hiddenBelow: mediaQueriesList,
  },
});
