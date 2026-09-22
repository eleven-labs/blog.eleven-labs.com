import type { cssProperties } from '@/design-system/constants';

/* Typography */
export type TextAlignType = keyof (typeof cssProperties)['text-align'];
export type TextTransformType = keyof (typeof cssProperties)['text-transform'];

/* Layout */
export type DisplayType = keyof (typeof cssProperties)['display'];

/* Flex Box */
export type AlignContentType = keyof (typeof cssProperties)['align-content'];
export type AlignItemsType = keyof (typeof cssProperties)['align-items'];
export type AlignSelfType = keyof (typeof cssProperties)['align-self'];
export type FlexBasisType = keyof (typeof cssProperties)['flex-basis'];
export type FlexDirectionType = keyof (typeof cssProperties)['flex-direction'];
export type FlexWrapType = keyof (typeof cssProperties)['flex-wrap'];
export type FlexType = keyof (typeof cssProperties)['flex'];
export type JustifyContentType = keyof (typeof cssProperties)['justify-content'];
