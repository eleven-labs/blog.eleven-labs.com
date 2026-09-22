export const mediaQueriesList = ['xs', 'sm', 'md', 'lg'] as const;

export type MediaQueryType = (typeof mediaQueriesList)[number];
