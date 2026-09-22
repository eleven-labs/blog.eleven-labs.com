import type { CategoryEndingBlockProps } from '@/components';

import React from 'react';

import { CategoryEndingBlock } from '@/components';
import { Box, Heading, Divider } from '@/design-system';

export type CategoryPageContentProps = {
  categoryEndingBlock?: CategoryEndingBlockProps;
  title: React.ReactNode;
  postCardList: React.ReactNode;
};

export const CategoryPageContent: React.FC<CategoryPageContentProps> = ({
  title,
  postCardList,
  categoryEndingBlock,
}) => (
  <Box>
    <Heading size="m" mb="l" color="primary">
      {title}
    </Heading>
    {postCardList}
    {categoryEndingBlock && (
      <>
        <Divider mt="m" />
        <CategoryEndingBlock mt="l" {...categoryEndingBlock} />
      </>
    )}
  </Box>
);
