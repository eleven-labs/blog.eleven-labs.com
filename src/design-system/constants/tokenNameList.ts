import type {
  ColorType,
  FontWeightType,
  HeadingSizeType,
  HeightType,
  IconNameType,
  SpacingType,
  TextSizeType,
  WidthType,
} from '@/design-system/types';

import { tokenVariables } from './tokenVariables';

export const colorTokenNameList = Object.keys(tokenVariables['color']) as ReadonlyArray<ColorType>;

export const spacingTokenNameList = Object.keys(tokenVariables['spacing']) as ReadonlyArray<SpacingType>;

export const widthTokenNameList = Object.keys(tokenVariables['width']) as ReadonlyArray<WidthType>;
export const heightTokenNameList = Object.keys(tokenVariables['height']) as ReadonlyArray<HeightType>;

export const fontWeightTokenNameList = Object.keys(tokenVariables['font-weight']) as ReadonlyArray<FontWeightType>;

export const iconTokenNameList = Object.keys(tokenVariables['asset']['icon']) as ReadonlyArray<IconNameType>;

export const headingSizeTokenNameList = Object.keys(
  tokenVariables['typography']['heading']
) as ReadonlyArray<HeadingSizeType>;
export const textSizeTokenNameList = Object.keys(tokenVariables['typography']['text']) as ReadonlyArray<TextSizeType>;
