import type {
  AlignContentType,
  AlignItemsType,
  JustifyContentType,
  SpacingType,
  TypeWithMediaQueriesType,
} from '@/design-system/types';

export interface FlexOrGridSystemProps {
  /**
   * align-items (including breakpoints modifiers)
   */
  alignItems?: TypeWithMediaQueriesType<AlignItemsType>;
  /**
   * align-content (including breakpoints modifiers)
   */
  alignContent?: TypeWithMediaQueriesType<AlignContentType>;
  /**
   * Defines horizontal alignment along the main axis (including breakpoints modifiers)
   */
  justifyContent?: TypeWithMediaQueriesType<JustifyContentType>;
  /**
   * Defines gap for col and row (including breakpoints modifiers)
   */
  gap?: TypeWithMediaQueriesType<SpacingType>;
  /**
   * Defines row gap (including breakpoints modifiers)
   */
  gapX?: TypeWithMediaQueriesType<SpacingType>;
  /**
   * Defines col gap (including breakpoints modifiers)
   */
  gapY?: TypeWithMediaQueriesType<SpacingType>;
}
