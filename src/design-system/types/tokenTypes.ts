import type { tokenVariables } from '@/design-system/constants';

export type ColorType = keyof (typeof tokenVariables)['color'];

export type SpacingType = keyof (typeof tokenVariables)['spacing'];

export type WidthType = keyof (typeof tokenVariables)['width'];
export type HeightType = keyof (typeof tokenVariables)['height'];

export type FontWeightType = keyof (typeof tokenVariables)['font-weight'];

export type IconNameType = keyof (typeof tokenVariables)['asset']['icon'];

export type HeadingSizeType = keyof (typeof tokenVariables)['typography']['heading'];
export type TextSizeType = keyof (typeof tokenVariables)['typography']['text'];
export type LineClampType = 1 | 2 | 3 | 4;
