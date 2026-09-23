import type { CategoryEndingBlockProps } from '@/components';

import React from 'react';

import { CategoryEndingBlock } from '@/components';
import { Divider, Heading } from '@/design-system';

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
  <div>
    <Heading size="m" className="mb-l text-primary">
      {title}
    </Heading>
    {postCardList}
    {categoryEndingBlock && (
      <>
        <Divider className="mt-m" />
        <CategoryEndingBlock className="mt-l" {...categoryEndingBlock} />
      </>
    )}
  </div>
);
