export const headingSizeList = ['xs', 's', 'm', 'l', 'xl'] as const;
export type HeadingSizeType = (typeof headingSizeList)[number];

export const textSizeList = ['xs', 's', 'm'] as const;
export type TextSizeType = (typeof textSizeList)[number];
