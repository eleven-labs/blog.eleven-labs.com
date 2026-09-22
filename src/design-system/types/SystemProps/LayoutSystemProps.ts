import type { DisplayType, HeightType, MediaQueryType, TypeWithMediaQueriesType, WidthType } from '@/design-system/types';

export interface LayoutSystemProps {
  /**
   * display (including breakpoints modifiers)
   */
  display?: TypeWithMediaQueriesType<DisplayType>;
  /**
   * width (including breakpoints modifiers)
   */
  width?: TypeWithMediaQueriesType<WidthType>;
  /**
   * height (including breakpoints modifiers)
   */
  height?: TypeWithMediaQueriesType<HeightType>;
  /**
   * Defines hidden above strategy with media queries (is similar to "min-width") (including breakpoints modifiers)
   */
  hiddenAbove?: MediaQueryType;
  /**
   * Defines hidden below strategy with media queries (is similar to "max-width") (including breakpoints modifiers)
   */
  hiddenBelow?: MediaQueryType;
}
