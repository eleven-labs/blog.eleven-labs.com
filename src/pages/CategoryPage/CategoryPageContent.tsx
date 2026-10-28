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
    <Heading size="m" className="mb-8 text-brand">
      {title}
    </Heading>
    {postCardList}
    {categoryEndingBlock && (
      <>
        <Divider className="mt-6" />
        <CategoryEndingBlock className="mt-8" {...categoryEndingBlock} />
      </>
    )}
  </div>
);
