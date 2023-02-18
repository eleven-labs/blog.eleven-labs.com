import { Box, BoxProps } from '@eleven-labs/design-system';
import React from 'react';

import { parseMarkdown } from './postContentHelper';

export type PostContentOptions = {
  content: string;
};
export type PostContentProps = BoxProps & PostContentOptions;

export const PostContent: React.FC<PostContentProps> = ({ content, ...props }) => {
  return <Box {...props}>{parseMarkdown(content)}</Box>;
};
