import type {
  FontWeightType,
  LineClampType,
  TextAlignType,
  TextSizeType,
  TextTransformType,
  TypeWithMediaQueriesType,
} from '@/design-system/types';

export interface TypographySystemProps {
  /**
   * text-align (including breakpoints modifiers)
   */
  textAlign?: TypeWithMediaQueriesType<TextAlignType>;
  /**
   * font-weight
   */
  fontWeight?: FontWeightType;
  /**
   * font-style italic
   */
  italic?: boolean;
  /**
   * text-decoration underline
   */
  underline?: boolean;
  /**
   * text-transform
   */
  textTransform?: TextTransformType;
  /**
   * text-size
   */
  textSize?: TextSizeType;
  /**
   * clamping text to a specific number of lines
   */
  lineClamp?: TypeWithMediaQueriesType<LineClampType>;
}
