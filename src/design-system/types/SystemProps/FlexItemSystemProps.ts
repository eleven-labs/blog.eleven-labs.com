import type { FlexBasisType, FlexType, TypeWithMediaQueriesType } from '@/design-system/types';

export interface FlexItemSystemProps {
  /**
   * Defines a flex basis, auto or number (including breakpoints modifiers)
   */
  flexBasis?: TypeWithMediaQueriesType<FlexBasisType>;
  /**
   * Defines a flex (including breakpoints modifiers)
   */
  flex?: TypeWithMediaQueriesType<FlexType>;
}
