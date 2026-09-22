import type { TypeWithMediaQueriesType , AlignSelfType } from '@/design-system/types';

export interface FlexOrGridItemSystemProps {
  /**
   * Defines a align self (including breakpoints modifiers)
   */
  alignSelf?: TypeWithMediaQueriesType<AlignSelfType>;
}
