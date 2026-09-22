import type { SpacingType, TypeWithMediaQueriesType } from '@/design-system/types';

export interface MarginSystemProps {
  /**
   * margin (including breakpoints modifiers)
   */
  m?: TypeWithMediaQueriesType<SpacingType | 'auto'>;
  /**
   * margin-top (including breakpoints modifiers)
   */
  mt?: TypeWithMediaQueriesType<SpacingType | 'auto'>;
  /**
   * margin-right (including breakpoints modifiers)
   */
  mr?: TypeWithMediaQueriesType<SpacingType | 'auto'>;
  /**
   * margin-bottom (including breakpoints modifiers)
   */
  mb?: TypeWithMediaQueriesType<SpacingType | 'auto'>;
  /**
   * margin-left (including breakpoints modifiers)
   */
  ml?: TypeWithMediaQueriesType<SpacingType | 'auto'>;
  /**
   * horizontal margin: margin-left and margin-right (including breakpoints modifiers)
   */
  mx?: TypeWithMediaQueriesType<SpacingType | 'auto'>;
  /**
   * vertical margin: margin-top and margin-bottom (including breakpoints modifiers)
   */
  my?: TypeWithMediaQueriesType<SpacingType | 'auto'>;
}

export interface PaddingSystemProps {
  /**
   * padding (including breakpoints modifiers)
   */
  p?: TypeWithMediaQueriesType<SpacingType>;
  /**
   * padding-top (including breakpoints modifiers)
   */
  pt?: TypeWithMediaQueriesType<SpacingType>;
  /**
   * padding-right (including breakpoints modifiers)
   */
  pr?: TypeWithMediaQueriesType<SpacingType>;
  /**
   * padding-bottom (including breakpoints modifiers)
   */
  pb?: TypeWithMediaQueriesType<SpacingType>;
  /**
   * padding-left (including breakpoints modifiers)
   */
  pl?: TypeWithMediaQueriesType<SpacingType>;
  /**
   * horizontal padding: padding-left and padding-right (including breakpoints modifiers)
   */
  px?: TypeWithMediaQueriesType<SpacingType>;
  /**
   * vertical padding: padding-top and padding-bottom (including breakpoints modifiers)
   */
  py?: TypeWithMediaQueriesType<SpacingType>;
}

export interface SpacingSystemProps extends MarginSystemProps, PaddingSystemProps {}
