import type { TypeWithMediaQueriesType , FlexDirectionType, FlexWrapType } from '@/design-system/types';

export interface FlexSystemProps {
  /**
   * flex-direction (including breakpoints modifiers)
   */
  flexDirection?: TypeWithMediaQueriesType<FlexDirectionType>;
  /**
   * Can flex items wrap onto multiple lines (including breakpoints modifiers)
   */
  flexWrap?: TypeWithMediaQueriesType<FlexWrapType>;
}
